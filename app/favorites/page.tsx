import { fetchUserFavorites } from '@/utils/actions';
import ProductsGrid from '@/components/products/ProductsGrid';
import PaginationControls from '@/components/admin/PaginationControls';
import { FAVORITES_PAGE_SIZE } from '@/utils/pagination';
import { redirect } from 'next/navigation';
import EmptyPageState from '@/components/global/EmptyPageState';

async function FavoritesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const { page } = await searchParams;
  const pageValue = Array.isArray(page) ? page[0] : page;
  const requestedPage = Number.parseInt(pageValue ?? '1', 10);
  const data = await fetchUserFavorites(requestedPage);
  const { items, totalItems, currentPage, totalPages } = data;
  if (requestedPage !== currentPage) {
    redirect(currentPage === 1 ? '/favorites' : `/favorites?page=${currentPage}`);
  }

  if (items.length === 0) {
    return (
      <EmptyPageState
        title='Favorites'
        description='Products you save will be collected here.'
        message='You have no favorites yet.'
      />
    );
  }
  const favoriteStates = {
    userId: items[0].clerkId,
    favoriteIds: Object.fromEntries(
      items.map((favorite) => [favorite.productId, favorite.id] as const)
    ),
  };

  return (
    <section className='min-w-0'>
      <header className='min-w-0 space-y-2'>
        <h1 className='break-words text-2xl font-semibold tracking-tight sm:text-3xl'>
          Favorites
        </h1>
        <p className='text-sm text-muted-foreground sm:text-base'>
          Products you have saved for later.
        </p>
      </header>
      <ProductsGrid
        products={items.map((favorite) => favorite.product)}
        favoriteStates={favoriteStates}
      />
      <div className='mt-8 min-w-0'>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={FAVORITES_PAGE_SIZE}
          href='/favorites'
          itemLabel='favorites'
        />
      </div>
    </section>
  );
}

export default FavoritesPage;
