'use client';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function CheckoutPage() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get('orderId');
  const cartId = searchParams.get('cartId');

  const fetchClientSecret = useCallback(async () => {
    if (!orderId || !cartId) {
      throw new Error('Missing order or cart information for checkout');
    }

    // Create a Checkout Session
    const response = await axios.post('/api/payment', {
      orderId: orderId,
      cartId: cartId,
    });
    // console.log('stripe checkout initiation response', response.data);
    return response.data.clientSecret;
  }, [orderId, cartId]);

  const options = useMemo(() => ({ fetchClientSecret }), [fetchClientSecret]);

  if (!orderId || !cartId) {
    return (
      <p className='text-center text-muted-foreground'>
        Checkout details are missing. Return to your cart and place the order again.
      </p>
    );
  }

  return (
    <div id='checkout'>
      <EmbeddedCheckoutProvider
        key={`${orderId}:${cartId}`}
        stripe={stripePromise}
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
