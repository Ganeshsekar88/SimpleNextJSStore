export const PRODUCTS_PAGE_SIZE = 6;
export const ORDERS_PAGE_SIZE = 6;

export const normalizePaginationPage = (page: number) => {
  const numericPage = Number(page);
  return Number.isFinite(numericPage)
    ? Math.max(1, Math.floor(numericPage))
    : 1;
};
