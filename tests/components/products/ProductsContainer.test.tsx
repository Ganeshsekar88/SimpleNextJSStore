import { render, screen } from '@testing-library/react';
import ProductsContainer from '@/components/products/ProductsContainer';
import { fetchAllProducts } from '@/utils/actions';

jest.mock('@/utils/actions', () => ({
  fetchAllProducts: jest.fn(),
}));

jest.mock('@/components/products/ProductsGrid', () => {
  return function MockProductsGrid({
    products,
  }: {
    products: { id: string }[];
  }) {
    return (
      <div data-testid='products-grid'>
        {products.map((product) => (
          <div key={product.id}>{product.id}</div>
        ))}
      </div>
    );
  };
});

jest.mock('@/components/products/ProductsList', () => {
  return function MockProductsList({
    products,
  }: {
    products: { id: string }[];
  }) {
    return (
      <div data-testid='products-list'>
        {products.map((product) => (
          <div key={product.id}>{product.id}</div>
        ))}
      </div>
    );
  };
});

jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    variant,
  }: {
    children: React.ReactNode;
    variant?: string;
  }) => (
    <div data-testid='button' data-variant={variant}>
      {children}
    </div>
  ),
}));

// jest.mock('@/components/ui/button', () => ({
//   Button: ({
//     children,
//   }: {
//     children: React.ReactNode;
//   }) => <div data-testid='button'>{children}</div>,
// }));

jest.mock('@/components/ui/separator', () => ({
  Separator: () => <hr data-testid='separator' />,
}));

jest.mock('next/link', () => {
  return function MockLink({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) {
    return <a href={href}>{children}</a>;
  };
});

jest.mock('react-icons/lu', () => ({
  LuLayoutGrid: () => <span data-testid='grid-icon' />,
  LuList: () => <span data-testid='list-icon' />,
}));

const mockedFetchAllProducts = jest.mocked(fetchAllProducts);

describe('ProductsContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the product count correctly for multiple products', async () => {
    mockedFetchAllProducts.mockResolvedValue([
      { id: 'product-1' },
      { id: 'product-2' },
      { id: 'product-3' },
    ] as any);

    const result = await ProductsContainer({
      layout: 'grid',
      search: '',
    });

    render(result);

    expect(screen.getByText('3 products')).toBeInTheDocument();
  });

  it('renders singular "product" when there is exactly one product', async () => {
    mockedFetchAllProducts.mockResolvedValue([
      { id: 'product-1' },
    ] as any);

    const result = await ProductsContainer({
      layout: 'grid',
      search: '',
    });

    render(result);

    expect(screen.getByText('1 product')).toBeInTheDocument();
  });

  it('renders the empty search message when no products are found', async () => {
    mockedFetchAllProducts.mockResolvedValue([]);

    const result = await ProductsContainer({
      layout: 'grid',
      search: 'laptop',
    });

    render(result);

    expect(
      screen.getByText('Sorry, no products matched your search...')
    ).toBeInTheDocument();

    expect(screen.queryByTestId('products-grid')).not.toBeInTheDocument();
    expect(screen.queryByTestId('products-list')).not.toBeInTheDocument();
  });

  it('renders ProductsGrid when layout is grid', async () => {
    const products = [
      { id: 'product-1' },
      { id: 'product-2' },
    ];

    mockedFetchAllProducts.mockResolvedValue(products as any);

    const result = await ProductsContainer({
      layout: 'grid',
      search: '',
    });

    render(result);

    expect(screen.getByTestId('products-grid')).toBeInTheDocument();
    expect(screen.queryByTestId('products-list')).not.toBeInTheDocument();

    expect(screen.getByText('product-1')).toBeInTheDocument();
    expect(screen.getByText('product-2')).toBeInTheDocument();
  });

  it('renders ProductsList when layout is not grid', async () => {
    const products = [
      { id: 'product-1' },
      { id: 'product-2' },
    ];

    mockedFetchAllProducts.mockResolvedValue(products as any);

    const result = await ProductsContainer({
      layout: 'list',
      search: '',
    });

    render(result);

    expect(screen.getByTestId('products-list')).toBeInTheDocument();
    expect(screen.queryByTestId('products-grid')).not.toBeInTheDocument();

    expect(screen.getByText('product-1')).toBeInTheDocument();
    expect(screen.getByText('product-2')).toBeInTheDocument();
  });

  it('fetches products using the supplied search term', async () => {
    mockedFetchAllProducts.mockResolvedValue([
      { id: 'product-1' },
    ] as any);

    const result = await ProductsContainer({
      layout: 'grid',
      search: 'iphone',
    });

    render(result);

    expect(mockedFetchAllProducts).toHaveBeenCalledTimes(1);
    expect(mockedFetchAllProducts).toHaveBeenCalledWith({
      search: 'iphone',
    });
  });

  it('renders the correct grid and list links without a search term', async () => {
    mockedFetchAllProducts.mockResolvedValue([
      { id: 'product-1' },
    ] as any);

    const result = await ProductsContainer({
      layout: 'grid',
      search: '',
    });

    render(result);

    // expect(
    //   screen.getByRole('link', { name: '' })
    // ).toHaveAttribute('href', '/products?layout=grid');

    const links = screen.getAllByRole('link');

    expect(links[0]).toHaveAttribute(
      'href',
      '/products?layout=grid'
    );

    expect(links[1]).toHaveAttribute(
      'href',
      '/products?layout=list'
    );
  });

  it('preserves the search term in the layout links', async () => {
    mockedFetchAllProducts.mockResolvedValue([
      { id: 'product-1' },
    ] as any);

    const result = await ProductsContainer({
      layout: 'grid',
      search: 'iphone',
    });

    render(result);

    const links = screen.getAllByRole('link');

    expect(links[0]).toHaveAttribute(
      'href',
      '/products?layout=grid&search=iphone'
    );

    expect(links[1]).toHaveAttribute(
      'href',
      '/products?layout=list&search=iphone'
    );
  });

  it('renders both layout controls', async () => {
    mockedFetchAllProducts.mockResolvedValue([
      { id: 'product-1' },
    ] as any);

    const result = await ProductsContainer({
      layout: 'grid',
      search: '',
    });

    render(result);

    expect(screen.getByTestId('grid-icon')).toBeInTheDocument();
    expect(screen.getByTestId('list-icon')).toBeInTheDocument();

    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('renders the separator', async () => {
    mockedFetchAllProducts.mockResolvedValue([
      { id: 'product-1' },
    ] as any);

    const result = await ProductsContainer({
      layout: 'grid',
      search: '',
    });

    render(result);

    expect(screen.getByTestId('separator')).toBeInTheDocument();
  });

  it('renders the grid layout button as the default variant when grid is selected', async () => {
    mockedFetchAllProducts.mockResolvedValue([
      { id: 'product-1' },
    ] as any);

    const result = await ProductsContainer({
      layout: 'grid',
      search: '',
    });

    render(result);

    const gridButton = screen
      .getByTestId('grid-icon')
      .closest('[data-testid="button"]');

    const listButton = screen
      .getByTestId('list-icon')
      .closest('[data-testid="button"]');

    expect(gridButton).toHaveAttribute('data-variant', 'default');
    expect(listButton).toHaveAttribute('data-variant', 'ghost');
  });

  it('renders the grid layout button as the default variant when list is selected', async () => {
    mockedFetchAllProducts.mockResolvedValue([
      { id: 'product-1' },
    ] as any);

    const result = await ProductsContainer({
      layout: 'list',
      search: '',
    });

    render(result);

    const gridButton = screen
      .getByTestId('grid-icon')
      .closest('[data-testid="button"]');

    const listButton = screen
      .getByTestId('list-icon')
      .closest('[data-testid="button"]');

    expect(gridButton).toHaveAttribute('data-variant', 'ghost');
    expect(listButton).toHaveAttribute('data-variant', 'default');
  });

});