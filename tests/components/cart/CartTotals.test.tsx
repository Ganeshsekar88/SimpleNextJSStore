import { render, screen } from '@testing-library/react';
import CartTotals from '@/components/cart/CartTotals';

jest.mock('@/utils/actions', () => ({ createOrderAction: jest.fn() }));
jest.mock('@/components/form/Buttons', () => ({
  SubmitButton: ({ text }: { text: string }) => <button type='submit'>{text}</button>,
}));
jest.mock('@/components/form/FormContainer', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <form>{children}</form>,
}));

describe('CartTotals', () => {
  it('presents the subtotal, fees, and final order total before checkout', () => {
    render(<CartTotals cart={{ cartTotal: 100, shipping: 5, tax: 10, orderTotal: 115 } as any} />);

    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();

    expect(screen.getByText('Shipping')).toBeInTheDocument();
    expect(screen.getByText('$5.00')).toBeInTheDocument();

    expect(screen.getByText('Tax')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();

    expect(screen.getByText('Order Total')).toBeInTheDocument();
    expect(screen.getByText('$115.00')).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: /place order/i })).toBeInTheDocument();
  });
});
