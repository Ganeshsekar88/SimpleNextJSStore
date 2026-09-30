/**
 * NavSearch + ProductsContainer integration tests
 *
 * These tests focus on the integration boundary between:
 *
 * NavSearch
 *    ↓
 * /products?search=<value>
 *    ↓
 * ProductsContainer({ search })
 *    ↓
 * fetchAllProducts({ search })
 *    ↓
 * filtered products rendered
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import NavSearch from '@/components/navbar/NavSearch';
import ProductsContainer from '@/components/products/ProductsContainer';
import { fetchAllProducts } from '@/utils/actions';

// -----------------------------------------------------------------------------
// Mocks
// -----------------------------------------------------------------------------

const mockReplace = jest.fn();

let mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

/**
 * Make debounce execute immediately.
 *
 * We are not testing the debounce library here.
 * We want to test the integration between the search input and routing.
 */
jest.mock('use-debounce', () => ({
  useDebouncedCallback: (callback: (value: string) => void) => {
    return callback;
  },
}));

jest.mock('@/utils/actions', () => ({
  fetchAllProducts: jest.fn(),
}));

/**
 * Keep the integration test focused on ProductsContainer.
 *
 * ProductsGrid / ProductsList have their own unit/integration tests.
 */
jest.mock('@/components/products/ProductsGrid', () => ({
  __esModule: true,
  default: ({ products }: { products: { id: string; name: string }[] }) => (
    <div data-testid="products-grid">
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  ),
}));

jest.mock('@/components/products/ProductsList', () => ({
  __esModule: true,
  default: ({ products }: { products: { id: string; name: string }[] }) => (
    <div data-testid="products-list">
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  ),
}));

// -----------------------------------------------------------------------------
// Test data
// -----------------------------------------------------------------------------

const products = [
  {
    id: '1',
    name: 'iPhone 15',
    company: 'Apple',
    description: 'Apple iPhone 15',
    featured: true,
    image: '/images/iphone.jpg',
    price: 799,
    createdAt: new Date(),
    updatedAt: new Date(),
    clerkId: 'clerk-1',
  },
  {
    id: '2',
    name: 'Samsung Galaxy',
    company: 'Samsung',
    description: 'Samsung Galaxy smartphone',
    featured: false,
    image: '/images/samsung.jpg',
    price: 699,
    createdAt: new Date(),
    updatedAt: new Date(),
    clerkId: 'clerk-2',
  },
];

const filteredProducts = [
  {
    id: '1',
    name: 'iPhone 15',
    company: 'Apple',
    description: 'Apple iPhone 15',
    featured: true,
    image: '/images/iphone.jpg',
    price: 799,
    createdAt: new Date(),
    updatedAt: new Date(),
    clerkId: 'clerk-1',
  },
];

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const mockedFetchAllProducts = jest.mocked(fetchAllProducts);

async function renderProductsContainer(
  layout = 'grid',
  search = ''
) {
  const component = await ProductsContainer({
    layout,
    search,
  });

  return render(component);
}

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe('NavSearch + ProductsContainer integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockSearchParams = new URLSearchParams();

    mockedFetchAllProducts.mockResolvedValue(products);
  });

  // ---------------------------------------------------------------------------
  // Initial integration
  // ---------------------------------------------------------------------------

  it('renders the search input and products container together', async () => {
    const productsContainer = await ProductsContainer({
      layout: 'grid',
      search: '',
    });

    render(
      <>
        <NavSearch />
        {productsContainer}
      </>
    );

    expect(
      screen.getByPlaceholderText('search product...')
    ).toBeInTheDocument();

    expect(screen.getByText('2 products')).toBeInTheDocument();

    expect(screen.getByTestId('products-grid')).toBeInTheDocument();

    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    expect(screen.getByText('Samsung Galaxy')).toBeInTheDocument();

    expect(mockedFetchAllProducts).toHaveBeenCalledWith({
      search: '',
    });
  });

  // ---------------------------------------------------------------------------
  // Search → Router integration
  // ---------------------------------------------------------------------------

  it('updates the products URL when a search is entered', async () => {
    render(<NavSearch />);

    const searchInput = screen.getByPlaceholderText('search product...');

    fireEvent.change(searchInput, {
      target: {
        value: 'iphone',
      },
    });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        '/products?search=iphone'
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Router → ProductsContainer integration
  // ---------------------------------------------------------------------------

  it('passes the searched value from the URL to fetchAllProducts', async () => {
    mockSearchParams = new URLSearchParams('search=iphone');

    mockedFetchAllProducts.mockResolvedValue(filteredProducts);

    render(
      <>
        <NavSearch />
        {await ProductsContainer({
          layout: 'grid',
          search: 'iphone',
        })}
      </>
    );

    expect(screen.getByDisplayValue('iphone')).toBeInTheDocument();

    expect(mockedFetchAllProducts).toHaveBeenCalledWith({
      search: 'iphone',
    });

    expect(screen.getByText('1 product')).toBeInTheDocument();

    expect(screen.getByText('iPhone 15')).toBeInTheDocument();

    expect(
      screen.queryByText('Samsung Galaxy')
    ).not.toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // Full search flow
  // ---------------------------------------------------------------------------

  it('integrates search navigation with the filtered ProductsContainer', async () => {
    /**
     * Step 1:
     * User starts on the products page.
     */
    mockSearchParams = new URLSearchParams();

    mockedFetchAllProducts.mockResolvedValue(products);

    const initialContainer = await ProductsContainer({
      layout: 'grid',
      search: '',
    });

     const { rerender } = render(
    <>
      <NavSearch />
      {initialContainer}
    </>
  );

    expect(screen.getByText('2 products')).toBeInTheDocument();

    /**
     * Step 2:
     * User enters a search term.
     */
    const searchInput = screen.getByPlaceholderText('search product...');

    fireEvent.change(searchInput, {
      target: {
        value: 'iphone',
      },
    });

    /**
     * Step 3:
     * NavSearch generates the URL that ProductsContainer
     * expects to receive.
     */
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        '/products?search=iphone'
      );
    });

    /**
     * Step 4:
     * Simulate the Next.js navigation resulting in the new
     * search parameter being passed to ProductsContainer.
     */
    mockSearchParams = new URLSearchParams('search=iphone');

    mockedFetchAllProducts.mockResolvedValue(filteredProducts);

    const filteredContainer = await ProductsContainer({
      layout: 'grid',
      search: 'iphone',
    });

    /**
     * Step 5:
     * Render the result of the navigation.
     */
    rerender(
      <>
        <NavSearch />
        {filteredContainer}
      </>
    );

    /**
     * Step 6:
     * Verify the complete integration contract.
     */
    expect(
      screen.getByDisplayValue('iphone')
    ).toBeInTheDocument();

    expect(mockedFetchAllProducts).toHaveBeenLastCalledWith({
      search: 'iphone',
    });

    expect(screen.getByText('1 product')).toBeInTheDocument();

    expect(screen.getByText('iPhone 15')).toBeInTheDocument();

    expect(
      screen.queryByText('Samsung Galaxy')
    ).not.toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // Clearing search
  // ---------------------------------------------------------------------------

  it('removes the search parameter when the search is cleared', async () => {
    mockSearchParams = new URLSearchParams('search=iphone');

    render(<NavSearch />);

    const searchInput = screen.getByDisplayValue('iphone');

    fireEvent.change(searchInput, {
      target: {
        value: '',
      },
    });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/products?');
    });
  });

  // ---------------------------------------------------------------------------
  // Search + layout preservation
  // ---------------------------------------------------------------------------

  it('preserves the layout parameter when searching', async () => {
    mockSearchParams = new URLSearchParams('layout=list');

    render(<NavSearch />);

    const searchInput = screen.getByPlaceholderText('search product...');

    fireEvent.change(searchInput, {
      target: {
        value: 'iphone',
      },
    });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        '/products?layout=list&search=iphone'
      );
    });
  });

  // ---------------------------------------------------------------------------
  // ProductsContainer layout integration
  // ---------------------------------------------------------------------------

  it('renders the filtered products using the selected list layout', async () => {
    mockedFetchAllProducts.mockResolvedValue(filteredProducts);

    await renderProductsContainer('list', 'iphone');

    expect(mockedFetchAllProducts).toHaveBeenCalledWith({
      search: 'iphone',
    });

    expect(screen.getByTestId('products-list')).toBeInTheDocument();

    expect(screen.getByText('iPhone 15')).toBeInTheDocument();

    expect(
      screen.queryByTestId('products-grid')
    ).not.toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // Empty search result integration
  // ---------------------------------------------------------------------------

  it('shows the no-results message when the search returns no products', async () => {
    mockedFetchAllProducts.mockResolvedValue([]);

    await renderProductsContainer('grid', 'nothing');

    expect(mockedFetchAllProducts).toHaveBeenCalledWith({
      search: 'nothing',
    });

    expect(
      screen.getByText(
        'Sorry, no products matched your search...'
      )
    ).toBeInTheDocument();

    expect(screen.queryByTestId('products-grid')).not.toBeInTheDocument();

    expect(screen.queryByTestId('products-list')).not.toBeInTheDocument();
  });
});