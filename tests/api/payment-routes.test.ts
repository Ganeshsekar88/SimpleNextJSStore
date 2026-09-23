/** @jest-environment node */

jest.mock('stripe', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    checkout: { sessions: { create: jest.fn(), retrieve: jest.fn() } },
  })),
}));
jest.mock('@/utils/db', () => ({
  __esModule: true,
  default: {
    order: { findUnique: jest.fn(), update: jest.fn() },
    cart: { findUnique: jest.fn(), delete: jest.fn() },
  },
}));
jest.mock('next/navigation', () => ({ redirect: jest.fn() }));

import { POST } from '@/app/api/payment/route';
import { GET } from '@/app/api/confirm/route';
import Stripe from 'stripe';
import db from '@/utils/db';
import { redirect } from 'next/navigation';

const mockFindOrder = db.order.findUnique as jest.Mock;
const mockFindCart = db.cart.findUnique as jest.Mock;
const mockUpdateOrder = db.order.update as jest.Mock;
const mockDeleteCart = db.cart.delete as jest.Mock;
const mockRedirect = redirect as unknown as jest.Mock;
const stripeInstances = (Stripe as unknown as jest.Mock).mock.results.map((result) => result.value);
const mockCreate = stripeInstances[0].checkout.sessions.create as jest.Mock;
const mockRetrieve = stripeInstances[1].checkout.sessions.retrieve as jest.Mock;

const cart = {
  id: 'cart-1',
  cartItems: [{ amount: 2, product: { name: 'Desk Lamp', image: 'https://example.com/lamp.jpg', price: 25 } }],
};

describe('payment route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFindOrder.mockResolvedValue({ id: 'order-1' });
    mockFindCart.mockResolvedValue(cart);
  });

  it('creates an embedded Stripe session from the persisted cart', async () => {
    mockCreate.mockResolvedValue({ client_secret: 'secret_123' });
    const response = await POST(new Request('http://store.test/api/payment', {
      method: 'POST', headers: { origin: 'http://store.test' }, body: JSON.stringify({ orderId: 'order-1', cartId: 'cart-1' }),
    }) as any);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ clientSecret: 'secret_123' });
    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
      metadata: { orderId: 'order-1', cartId: 'cart-1' },
      return_url: 'http://store.test/api/confirm?session_id={CHECKOUT_SESSION_ID}',
      line_items: [expect.objectContaining({ quantity: 2, price_data: expect.objectContaining({ unit_amount: 2500 }) })],
    }));
  });

  it('returns not found when the order or cart cannot be loaded', async () => {
    mockFindCart.mockResolvedValue(null);
    const response = await POST(new Request('http://store.test/api/payment', {
      method: 'POST', body: JSON.stringify({ orderId: 'missing', cartId: 'missing' }),
    }) as any);
    expect(response.status).toBe(404);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('returns an internal error when Stripe rejects session creation', async () => {
    mockCreate.mockRejectedValue(new Error('Stripe unavailable'));
    const response = await POST(new Request('http://store.test/api/payment', {
      method: 'POST', body: JSON.stringify({ orderId: 'order-1', cartId: 'cart-1' }),
    }) as any);
    expect(response.status).toBe(500);
  });
});

describe('payment confirmation route', () => {
  beforeEach(() => jest.clearAllMocks());

  it('marks a completed order paid, clears its cart, and sends the user to orders', async () => {
    mockRetrieve.mockResolvedValue({ status: 'complete', metadata: { orderId: 'order-1', cartId: 'cart-1' } });
    await GET(new Request('http://store.test/api/confirm?session_id=session-1') as any);

    expect(mockUpdateOrder).toHaveBeenCalledWith({ where: { id: 'order-1' }, data: { isPaid: true } });
    expect(mockDeleteCart).toHaveBeenCalledWith({ where: { id: 'cart-1' } });
    expect(mockRedirect).toHaveBeenCalledWith('/orders');
  });

  it('does not mutate the order or cart when payment is incomplete', async () => {
    mockRetrieve.mockResolvedValue({ status: 'open', metadata: { orderId: 'order-1', cartId: 'cart-1' } });
    await GET(new Request('http://store.test/api/confirm?session_id=session-1') as any);

    expect(mockUpdateOrder).not.toHaveBeenCalled();
    expect(mockDeleteCart).not.toHaveBeenCalled();
    expect(mockRedirect).toHaveBeenCalledWith('/orders');
  });

  it('returns an internal error when Stripe cannot retrieve the session', async () => {
    mockRetrieve.mockRejectedValue(new Error('Stripe unavailable'));
    const response = await GET(new Request('http://store.test/api/confirm?session_id=session-1') as any);
    expect(response.status).toBe(500);
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
