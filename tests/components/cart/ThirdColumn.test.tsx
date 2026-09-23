import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ThirdColumn from '@/components/cart/ThirdColumn';

import {
    removeCartItemAction,
    updateCartItemAction,
} from '@/utils/actions';

import { useToast } from '@/components/ui/use-toast';

jest.mock('@/utils/actions', () => ({
    removeCartItemAction: jest.fn(),
    updateCartItemAction: jest.fn(),
}));

const mockToast = jest.fn();

jest.mock('@/components/ui/use-toast', () => ({
    useToast: () => ({
        toast: mockToast,
    }),
}));


jest.mock('@/components/single-product/SelectProductAmount', () => ({
    __esModule: true,

    Mode: {
        CartItem: 'cartItem',
    },

    default: ({
        amount,
        setAmount,
        isLoading,
    }: {
        amount: number;
        setAmount: (value: number) => Promise<void>;
        isLoading: boolean;
    }) => (
        <div>
            <span>Quantity: {amount}</span>

            <button
                type='button'
                onClick={() => setAmount(5)}
                disabled={isLoading}
            >
                Change quantity
            </button>
        </div>
    ),
}));

jest.mock('@/components/form/FormContainer', () => ({
    __esModule: true,
    default: ({
        children,
        action,
    }: {
        children: React.ReactNode;
        action: (formData: FormData) => Promise<unknown>;
    }) => (
        <form>
            {children}
        </form>
    ),
}));


jest.mock('@/components/form/Buttons', () => ({
    SubmitButton: ({
        text,
        ...props
    }: {
        text?: string;
        className?: string;
        size?: 'default' | 'lg' | 'sm';
    }) => (
        <button type='submit' {...props}>
            {text}
        </button>
    ),
}));

describe('ThirdColumn', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the initial quantity', () => {
        render(
            <ThirdColumn
                quantity={1}
                id='cart-item-123'
            />
        );

        expect(
            screen.getByText('Quantity: 1')
        ).toBeInTheDocument();
    });

    it('updates the cart item quantity', async () => {
        (updateCartItemAction as jest.Mock).mockResolvedValue({
            message: 'cart updated',
        });

        render(
            <ThirdColumn
                quantity={1}
                id='cart-item-123'
            />
        );

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Change quantity',
            })
        );

        await waitFor(() => {
            expect(updateCartItemAction).toHaveBeenCalledWith({
                amount: 5,
                cartItemId: 'cart-item-123',
            });
        });
    });

    it('shows calculating and result toasts when quantity changes', async () => {
        (updateCartItemAction as jest.Mock).mockResolvedValue({
            message: 'cart updated',
        });

        render(
            <ThirdColumn
                quantity={1}
                id='cart-item-123'
            />
        );

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Change quantity',
            })
        );

        expect(mockToast).toHaveBeenCalledWith({
            description: 'Calculating...',
        });

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith({
                description: 'cart updated',
            });
        });
    });

    it('updates the displayed quantity after the action succeeds', async () => {
        (updateCartItemAction as jest.Mock).mockResolvedValue({
            message: 'cart updated',
        });

        render(
            <ThirdColumn
                quantity={1}
                id='cart-item-123'
            />
        );

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Change quantity',
            })
        );

        await waitFor(() => {
            expect(
                screen.getByText('Quantity: 5')
            ).toBeInTheDocument();
        });
    });

    it('renders the remove button and cart item id', () => {
        render(
            <ThirdColumn
                quantity={1}
                id='cart-item-123'
            />
        );

        expect(
            screen.getByRole('button', {
                name: 'remove',
            })
        ).toBeInTheDocument();

        const input = screen.getByDisplayValue('cart-item-123');

        expect(input).toHaveAttribute('name', 'id');
        expect(input).toHaveAttribute('type', 'hidden');
    });

});



