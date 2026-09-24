import { render, screen } from '@testing-library/react';
import AddToCart from '@/components/single-product/AddToCart';
import userEvent from '@testing-library/user-event';

const mockUseAuth = jest.fn();

jest.mock('@clerk/nextjs', () => ({
  useAuth: () => mockUseAuth(),
  SignInButton: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock('@/utils/actions', () => ({ addToCartAction: jest.fn() }));
jest.mock('@/components/form/Buttons', () => ({
  ProductSignInButton: () => <button type='button'>Please Sign In</button>,
  SubmitButton: ({ text }: { text: string }) => <button type='submit'>{text}</button>,
}));
jest.mock('@/components/form/FormContainer', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <form>{children}</form>,
}));

// fake dropdown selection
// jest.mock('@/components/single-product/SelectProductAmount', () => ({
//   Mode: { SingleProduct: 'singleProduct', CartItem: 'cartItem' },
//   __esModule: true,
//   default: () => <span>Amount selector</span>,
// }));

describe('AddToCart', () => {
  it('asks an anonymous visitor to sign in instead of exposing cart submission', () => {
    mockUseAuth.mockReturnValue({ userId: null });
    render(<AddToCart productId='product-1' />);

    expect(screen.getByRole('button', { name: /please sign in/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /add to cart/i })).not.toBeInTheDocument();
  });

  it('shows the add-to-cart form for an authenticated visitor', () => {
    mockUseAuth.mockReturnValue({ userId: 'user-1' });
    render(<AddToCart productId='product-1' />);

    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue('product-1')).toHaveAttribute('name', 'productId');
    expect(screen.getByDisplayValue('1')).toHaveAttribute('name', 'amount');
  });

  it('updates the amount when the user selects a different amount', async () => {
    mockUseAuth.mockReturnValue({ userId: 'user-1' });

    const user = userEvent.setup();

    render(<AddToCart productId="product-1" />);

    const amountSelector = screen.getByRole('combobox');

    await user.click(amountSelector);

    const option = await screen.findByRole('option', { name: '2' });

    await user.click(option);

    expect(screen.getByDisplayValue('2')).toHaveAttribute(
      'name',
      'amount'
    );
  });
});
