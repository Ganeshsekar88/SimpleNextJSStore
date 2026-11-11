import {
  fetchFeaturedProducts,
  fetchProductFavoriteStates,
} from '@/utils/actions';
import EmptyList from '../global/EmptyList';
import SectionTitle from '../global/SectionTitle';
import ProductsGrid from '../products/ProductsGrid';
import PaginationControls from '../admin/PaginationControls';
import { FEATURED_PAGE_SIZE } from '@/utils/pagination';
import { redirect } from 'next/navigation';

async function FeaturedProducts({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const params = await searchParams;
  const pageValue = Array.isArray(params.page) ? params.page[0] : params.page;
  const parsedPage = Number.parseInt(pageValue ?? '1', 10);
  const page = Number.isFinite(parsedPage) ? Math.max(1, parsedPage) : 1;
  const data = await fetchFeaturedProducts(page);
  const { items, totalItems, currentPage, totalPages } = data;
  if (page !== currentPage) {
    redirect(currentPage === 1 ? '/' : `/?page=${currentPage}`);
  }

  if (items.length === 0) {
    return (
      <section className='pt-24'>
        <SectionTitle text='featured products' />
        <div className='pt-12' >
          <EmptyList />
        </div>
      </section>
    );
  }
  const favoriteStates = await fetchProductFavoriteStates(
    items.map((product) => product.id)
  );

  return (
    <section className='pt-24'>
      <SectionTitle text='featured products' />
      <ProductsGrid products={items} favoriteStates={favoriteStates} />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={FEATURED_PAGE_SIZE}
        href='/'
        itemLabel='featured products'
      />
    </section>
  );
}
export default FeaturedProducts;
