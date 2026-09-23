
import { render, screen } from '@testing-library/react';
import CartItemsList from '@/components/cart/CartItemList';
import type { CartItemWithProduct } from '@/utils/types';

jest.mock('@/utils/actions', () => ({
  removeCartItemAction: jest.fn(),
  updateCartItemAction: jest.fn(),
}));

jest.mock('@/components/cart/ThirdColumn', () => ({
  __esModule: true,
  default: ({
    quantity,
    id,
  }: {
    quantity: number;
    id: string;
  }) => (
    <div data-testid='third-column'>
      <span>Quantity: {quantity}</span>
      <span>Cart Item ID: {id}</span>
    </div>
  ),
}));

const mockCartItem: CartItemWithProduct = {
    id: 'cart-item-123',
    productId: 'product-123',
    cartId: 'cart-123',
    amount: 2,
    createdAt: new Date(),
    updatedAt: new Date(),

    product: {
        id: 'product-123',
        image: '/images/nike.jpg',
        name: 'Nike Shoes',
        company: 'Nike',
        price: 115,
        createdAt: new Date(),
        updatedAt: new Date(),
        description: 'Nike running shoes',
        featured: false,
        clerkId: 'clerk-product-123',
    },
};

describe('CartItemsList', () => {
    it('renders the cart item product information', () => {
        render(<CartItemsList cartItems={[mockCartItem]} />);

        expect(
            screen.getByRole('img', {
                name: 'Nike Shoes',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole('heading', {
                name: 'Nike Shoes',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText('Nike')
        ).toBeInTheDocument();

        expect(
            screen.getByText('$115.00')
        ).toBeInTheDocument();
    });

    it('renders the product link with the correct product id', () => {
        render(<CartItemsList cartItems={[mockCartItem]} />);

        expect(
            screen.getByRole('link', {
                name: 'Nike Shoes',
            })
        ).toHaveAttribute('href', '/products/product-123');
    });

    it('renders the cart item quantity', () => {
        render(<CartItemsList cartItems={[mockCartItem]} />);

        expect(
            screen.getByText('Quantity: 2')
        ).toBeInTheDocument();
    });

    it('renders multiple cart items', () => {

        const secondCartItem: CartItemWithProduct = {
            id: 'cart-item-456',
            productId: 'product-456',
            cartId: 'cart-123',
            amount: 3,
            createdAt: new Date(),
            updatedAt: new Date(),

            product: {
                id: 'product-456',
                image: '/images/adidas.jpg',
                name: 'Adidas Shoes',
                company: 'Adidas',
                price: 95,
                createdAt: new Date(),
                updatedAt: new Date(),
                description: 'Adidas running shoes',
                featured: false,
                clerkId: 'clerk-product-456',
            },
        };

        render(
            <CartItemsList
                cartItems={[mockCartItem, secondCartItem]}
            />
        );

        expect(
            screen.getByRole('img', {
                name: 'Nike Shoes',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole('img', {
                name: 'Adidas Shoes',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole('heading', {
                name: 'Nike Shoes',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole('heading', {
                name: 'Adidas Shoes',
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText('Quantity: 2')
        ).toBeInTheDocument();

        expect(
            screen.getByText('Quantity: 3')
        ).toBeInTheDocument();

        expect(
            screen.getByText('$115.00')
        ).toBeInTheDocument();

        expect(
            screen.getByText('$95.00')
        ).toBeInTheDocument();
    });

    it('renders no cart items when cartItems is empty', () => {
        render(<CartItemsList cartItems={[]} />);

        expect(
            screen.queryByRole('img')
        ).not.toBeInTheDocument();

        expect(
            screen.queryByRole('heading')
        ).not.toBeInTheDocument();

        expect(
            screen.queryByRole('link')
        ).not.toBeInTheDocument();
    });
});