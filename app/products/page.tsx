import ProductsContainer from '@/components/products/ProductsContainer';

async function ProductsPage({
  searchParams,
}: {

  searchParams: Promise<{
    layout?: string | string[];
    search?: string | string[];
    page?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const layoutValue = Array.isArray(params.layout) ? params.layout[0] : params.layout;
  const searchValue = Array.isArray(params.search) ? params.search[0] : params.search;
  const pageValue = Array.isArray(params.page) ? params.page[0] : params.page;
  const layout = layoutValue === 'list' ? 'list' : 'grid';
  const search = searchValue || '';
  const requestedPage = Number.parseInt(pageValue ?? '1', 10);
  return (
    <>
      <ProductsContainer layout={layout} search={search} page={requestedPage} />
    </>
  );
}
export default ProductsPage;
