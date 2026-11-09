import ProductsGrid from './ProductsGrid';
import ProductsList from './ProductsList';
import { LuLayoutGrid, LuList } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { fetchAllProducts, fetchProductsPage } from '@/utils/actions';
import { PRODUCTS_PAGE_SIZE } from '@/utils/pagination';
import Link from 'next/link';
import PaginationControls from '@/components/admin/PaginationControls';
import { redirect } from 'next/navigation';

function productsHref(layout: string, search: string, page = 1) {
  const query = new URLSearchParams();
  query.set('layout', layout);
  if (search) query.set('search', search);
  if (page > 1) query.set('page', String(page));
  return `/products?${query.toString()}`;
}

async function ProductsContainer({
  layout,
  search,
  page,
}: {
  layout: string;
  search: string;
  page?: number;
}) {
  const pageData = page === undefined
    ? {
        items: await fetchAllProducts({ search }),
        totalItems: 0,
        currentPage: 1,
        totalPages: 1,
      }
    : await fetchProductsPage({ search, page });
  const products = pageData.items;
  const totalProducts = page === undefined ? products.length : pageData.totalItems;
  if (page !== undefined && page !== pageData.currentPage) {
    redirect(productsHref(layout, search, pageData.currentPage));
  }

  return (
    <>
      {/* HEADER */}
      <section className='min-w-0'>
        <div className='flex min-w-0 items-center justify-between gap-4'>
          <h4 className='font-medium text-lg'>
            {totalProducts} product{totalProducts > 1 && 's'}
          </h4>
          <div className='flex shrink-0 gap-x-2 sm:gap-x-4'>
            <Button
              variant={layout === 'grid' ? 'default' : 'ghost'}
              size='icon'
              asChild
            >
              <Link
                href={productsHref('grid', search, pageData.currentPage)}
                aria-label='Show products in a grid'
                aria-current={layout === 'grid' ? 'page' : undefined}
              >
                <LuLayoutGrid />
              </Link>
            </Button>
            <Button
              variant={layout === 'list' ? 'default' : 'ghost'}
              size='icon'
              asChild
            >
              <Link
                href={productsHref('list', search, pageData.currentPage)}
                aria-label='Show products in a list'
                aria-current={layout === 'list' ? 'page' : undefined}
              >
                <LuList />
              </Link>
            </Button>
          </div>
        </div>
        <Separator className='mt-4' />
      </section>
      {/* PRODUCTS */}
      <div className='min-w-0'>
        {totalProducts === 0 ? (
          <h5 className='text-2xl mt-16'>
            Sorry, no products matched your search...
          </h5>
        ) : layout === 'grid' ? (
          <ProductsGrid products={products} />
        ) : (
          <ProductsList products={products} />
        )}
      </div>
      <PaginationControls
        currentPage={pageData.currentPage}
        totalPages={pageData.totalPages}
        totalItems={totalProducts}
        pageSize={PRODUCTS_PAGE_SIZE}
        href={productsHref(layout, search)}
        itemLabel='products'
      />
    </>
  );
}
export default ProductsContainer;
