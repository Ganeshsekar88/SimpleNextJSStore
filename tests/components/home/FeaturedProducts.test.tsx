import { render, screen } from '@testing-library/react';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import { fetchFeaturedProducts } from '@/utils/actions';

jest.mock('@/utils/actions', () => ({
  fetchFeaturedProducts: jest.fn(),
}));

jest.mock('@/components/global/EmptyList', () => {
  return function MockEmptyList() {
    return <div data-testid="empty-list">No items found.</div>;
  };
});

jest.mock('@/components/global/SectionTitle', () => {
  return function MockSectionTitle({ text }: { text: string }) {
    return <h2 data-testid="section-title">{text}</h2>;
  };
});

jest.mock('@/components/products/ProductsGrid', () => {
  return function MockProductsGrid({
    products,
  }: {
    products: unknown[];
  }) {
    return (
      <div data-testid="products-grid">
        {products.map((product: any) => (
          <div key={product.id}>{product.name}</div>
        ))}
      </div>
    );
  };
});

const mockFetchFeaturedProducts =
  fetchFeaturedProducts as jest.MockedFunction<typeof fetchFeaturedProducts>;

describe('FeaturedProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls fetchFeaturedProducts when rendered', async () => {
    mockFetchFeaturedProducts.mockResolvedValue([]);

    await FeaturedProducts();

    expect(mockFetchFeaturedProducts).toHaveBeenCalledTimes(1);
  });

  it('renders EmptyList when there are no featured products', async () => {
    mockFetchFeaturedProducts.mockResolvedValue([]);

    render(await FeaturedProducts());

    expect(screen.getByTestId('empty-list')).toBeInTheDocument();

    expect(screen.queryByTestId('section-title')).not.toBeInTheDocument();
    expect(screen.queryByTestId('products-grid')).not.toBeInTheDocument();
  });

  it('renders SectionTitle and ProductsGrid when products exist', async () => {
    const products = [
      {
        id: 'product-1',
        name: 'Classic Watch',
      },
      {
        id: 'product-2',
        name: 'Leather Bag',
      },
    ] as Awaited<ReturnType<typeof fetchFeaturedProducts>>;

    mockFetchFeaturedProducts.mockResolvedValue(products);

    render(await FeaturedProducts());

    expect(screen.getByTestId('section-title')).toHaveTextContent(
      'featured products'
    );

    expect(screen.getByTestId('products-grid')).toBeInTheDocument();

    expect(screen.getByText('Classic Watch')).toBeInTheDocument();
    expect(screen.getByText('Leather Bag')).toBeInTheDocument();

    expect(screen.queryByTestId('empty-list')).not.toBeInTheDocument();
  });

  it('passes the fetched products to ProductsGrid', async () => {
    const products = [
      {
        id: 'product-1',
        name: 'Classic Watch',
      },
      {
        id: 'product-2',
        name: 'Leather Bag',
      },
    ] as Awaited<ReturnType<typeof fetchFeaturedProducts>>;

    mockFetchFeaturedProducts.mockResolvedValue(products);

    render(await FeaturedProducts());

    const productsGrid = screen.getByTestId('products-grid');

    expect(productsGrid).toHaveTextContent('Classic Watch');
    expect(productsGrid).toHaveTextContent('Leather Bag');
  });

  it('renders the featured products section with the expected class', async () => {
    const products = [
      {
        id: 'product-1',
        name: 'Classic Watch',
      },
    ] as Awaited<ReturnType<typeof fetchFeaturedProducts>>;

    mockFetchFeaturedProducts.mockResolvedValue(products);

    const { container } = render(await FeaturedProducts());

    const section = container.querySelector('section');

    expect(section).toHaveClass('pt-24');
  });
});