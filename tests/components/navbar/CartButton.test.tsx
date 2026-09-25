import { render, screen } from '@testing-library/react';
import CartButton from '@/components/navbar/CartButton';
import { fetchCartItems } from '@/utils/actions';

jest.mock('@/utils/actions', () => ({
  fetchCartItems: jest.fn(),
}));

jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

jest.mock('react-icons/lu', () => ({
  LuShoppingCart: () => (
    <svg data-testid='shopping-cart-icon' aria-label='shopping cart' />
  ),
}));

describe('CartButton', () => {
  const mockedFetchCartItems = fetchCartItems as jest.MockedFunction<
    typeof fetchCartItems
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and displays the number of items in the cart', async () => {
    mockedFetchCartItems.mockResolvedValue(3);

    const result = await CartButton();

    render(result);

    expect(mockedFetchCartItems).toHaveBeenCalledTimes(1);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('displays 0 when the cart is empty', async () => {
    mockedFetchCartItems.mockResolvedValue(0);

    const result = await CartButton();

    render(result);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('links to the cart page', async () => {
    mockedFetchCartItems.mockResolvedValue(3);

    const result = await CartButton();

    render(result);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/cart');
  });

  it('renders the shopping cart icon', async () => {
    mockedFetchCartItems.mockResolvedValue(3);

    const result = await CartButton();

    render(result);

    expect(screen.getByTestId('shopping-cart-icon')).toBeInTheDocument();
  });

  it('applies the expected button and badge classes', async () => {
    mockedFetchCartItems.mockResolvedValue(3);

    const result = await CartButton();

    render(result);

    const link = screen.getByRole('link');
    const count = screen.getByText('3');

    expect(link).toHaveClass(
      'flex',
      'justify-center',
      'items-center',
      'relative'
    );

    expect(count).toHaveClass(
      'absolute',
      '-top-3',
      '-right-3',
      'bg-primary',
      'text-white',
      'rounded-full',
      'h-6',
      'w-6',
      'flex',
      'items-center',
      'justify-center',
      'text-xs'
    );
  });
});