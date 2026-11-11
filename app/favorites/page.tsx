import { fetchUserFavorites } from '@/utils/actions';
import SectionTitle from '@/components/global/SectionTitle';
import ProductsGrid from '@/components/products/ProductsGrid';
import PaginationControls from '@/components/admin/PaginationControls';
import { FAVORITES_PAGE_SIZE } from '@/utils/pagination';
import { redirect } from 'next/navigation';

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

  if (items.length === 0)
    return <SectionTitle text='You have no favorites yet.' />;
  const favoriteStates = {
    userId: items[0].clerkId,
    favoriteIds: Object.fromEntries(
      items.map((favorite) => [favorite.productId, favorite.id] as const)
    ),
  };

  return (
    <div>
      <SectionTitle text='Favorites' />
      <ProductsGrid
        products={items.map((favorite) => favorite.product)}
        favoriteStates={favoriteStates}
      />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={FAVORITES_PAGE_SIZE}
        href='/favorites'
        itemLabel='favorites'
      />
    </div>
  );
}

export default FavoritesPage;
