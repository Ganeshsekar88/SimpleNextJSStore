import { render, screen } from '@testing-library/react';
import ProductsGrid from '@/components/products/ProductsGrid';
import { formatCurrency } from '@/utils/format';
import FavoriteToggleButton from '@/components/products/FavoriteToggleButton';

jest.mock('@/utils/format', () => ({
  formatCurrency: jest.fn(),
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

jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
  }: {
    src: string;
    alt: string;
  }) {
    return <img src={src} alt={alt} />;
  };
});

jest.mock('@/components/products/FavoriteToggleButton', () => {
  return jest.fn(({ productId }: { productId: string }) => (
    <button data-testid={`favorite-${productId}`}>Favorite</button>
  ));
});

// jest.mock('@/components/ui/card', () => ({
//   Card: ({ children }: { children: React.ReactNode }) => (
//     <div data-testid="card">{children}</div>
//   ),
//   CardContent: ({ children }: { children: React.ReactNode }) => (
//     <div data-testid="card-content">{children}</div>
//   ),
// }));

jest.mock('@/components/ui/card', () => ({
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),

  CardContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
}));

const mockedFormatCurrency = jest.mocked(formatCurrency);
const mockedFavoriteToggleButton = jest.mocked(FavoriteToggleButton);

const products = [
  {
    id: 'product-1',
    name: 'Classic T-Shirt',
    price: 2999,
    image: '/images/tshirt.jpg',
    company: 'Acme',
  },
  {
    id: 'product-2',
    name: 'Running Shoes',
    price: 5999,
    image: '/images/shoes.jpg',
    company: 'Nike',
  },
  {
    id: 'product-3',
    name: 'Leather Wallet',
    price: 1999,
    image: '/images/wallet.jpg',
    company: 'Leather Co',
  },
] as any;

describe('ProductsGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedFormatCurrency
      .mockReturnValueOnce('$2,999.00')
      .mockReturnValueOnce('$5,999.00')
      .mockReturnValueOnce('$1,999.00');
  });

  it('renders the products container with the grid layout', () => {
    const { container } = render(<ProductsGrid products={products} />);

    const productsContainer = container.firstChild;

    expect(productsContainer).toHaveClass(
      'pt-12',
      'grid',
      'gap-4',
      'md:grid-cols-2',
      'lg:grid-cols-3'
    );
  });

  it('renders all products', () => {
    render(<ProductsGrid products={products} />);

    expect(screen.getByText('Classic T-Shirt')).toBeInTheDocument();
    expect(screen.getByText('Running Shoes')).toBeInTheDocument();
    expect(screen.getByText('Leather Wallet')).toBeInTheDocument();
  });

  it('renders the correct number of product cards', () => {
    render(<ProductsGrid products={products} />);

    expect(screen.getAllByTestId('card')).toHaveLength(products.length);
  });

  it('renders each product image with the product name as its alt text', () => {
    render(<ProductsGrid products={products} />);

    expect(
      screen.getByRole('img', { name: 'Classic T-Shirt' })
    ).toHaveAttribute('src', '/images/tshirt.jpg');

    expect(
      screen.getByRole('img', { name: 'Running Shoes' })
    ).toHaveAttribute('src', '/images/shoes.jpg');

    expect(
      screen.getByRole('img', { name: 'Leather Wallet' })
    ).toHaveAttribute('src', '/images/wallet.jpg');
  });

  it('formats each product price using formatCurrency', () => {
    render(<ProductsGrid products={products} />);

    expect(mockedFormatCurrency).toHaveBeenCalledTimes(3);

    expect(mockedFormatCurrency).toHaveBeenNthCalledWith(1, 2999);
    expect(mockedFormatCurrency).toHaveBeenNthCalledWith(2, 5999);
    expect(mockedFormatCurrency).toHaveBeenNthCalledWith(3, 1999);
  });

  it('renders the formatted price returned by formatCurrency', () => {
    render(<ProductsGrid products={products} />);

    expect(screen.getByText('$2,999.00')).toBeInTheDocument();
    expect(screen.getByText('$5,999.00')).toBeInTheDocument();
    expect(screen.getByText('$1,999.00')).toBeInTheDocument();
  });

  it('links each product card to the corresponding product page', () => {
    render(<ProductsGrid products={products} />);

    expect(
      screen.getByRole('link', {
        name: /classic t-shirt/i,
      })
    ).toHaveAttribute('href', '/products/product-1');

    expect(
      screen.getByRole('link', {
        name: /running shoes/i,
      })
    ).toHaveAttribute('href', '/products/product-2');

    expect(
      screen.getByRole('link', {
        name: /leather wallet/i,
      })
    ).toHaveAttribute('href', '/products/product-3');
  });

  it('renders a FavoriteToggleButton for every product', () => {
    render(<ProductsGrid products={products} />);

    expect(
      screen.getByTestId('favorite-product-1')
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('favorite-product-2')
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('favorite-product-3')
    ).toBeInTheDocument();
  });

  it('passes the correct product id to each FavoriteToggleButton', () => {
    render(<ProductsGrid products={products} />);

    expect(mockedFavoriteToggleButton).toHaveBeenNthCalledWith(
      1,
      { productId: 'product-1' },
      expect.anything()
    );

    expect(mockedFavoriteToggleButton).toHaveBeenNthCalledWith(
      2,
      { productId: 'product-2' },
      expect.anything()
    );

    expect(mockedFavoriteToggleButton).toHaveBeenNthCalledWith(
      3,
      { productId: 'product-3' },
      expect.anything()
    );
  });

  it('does not render any product cards when products is empty', () => {
    render(<ProductsGrid products={[]} />);

    expect(screen.queryByTestId('card')).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();

    expect(mockedFavoriteToggleButton).not.toHaveBeenCalled();
    expect(mockedFormatCurrency).not.toHaveBeenCalled();
  });
});