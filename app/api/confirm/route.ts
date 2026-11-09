import Stripe from 'stripe';
import { redirect } from 'next/navigation';
import { type NextRequest } from 'next/server';
import db from '@/utils/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return Response.json(
      { error: 'Missing Stripe session ID' },
      { status: 400 }
    );
  }

  try {
    // Retrieve Checkout Session with expanded PaymentIntent and PaymentMethod
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent.payment_method'],
    });

    const orderId = session.metadata?.orderId;
    const cartId = session.metadata?.cartId;

    if (!orderId || !cartId) {
      return Response.json(
        { error: 'Missing order or cart information' },
        { status: 400 }
      );
    }

    // Only process successfully paid sessions
    if (session.payment_status === 'paid') {
      const paymentIntent = session.payment_intent;

      // Retrieve Stripe PaymentIntent ID
      const paymentId =
        typeof paymentIntent === 'string'
          ? paymentIntent
          : paymentIntent?.id;

      // Retrieve actual payment method
      const paymentMethod =
        typeof paymentIntent === 'object' &&
        paymentIntent !== null &&
        typeof paymentIntent.payment_method === 'object' &&
        paymentIntent.payment_method !== null
          ? paymentIntent.payment_method.type
          : null;

      if (!paymentId) {
        throw new Error('Stripe PaymentIntent ID not found');
      }

      // Update order with Stripe payment information
      await db.order.update({
        where: {
          id: orderId,
        },
        data: {
          isPaid: true,
          paymentId,
          paymentMethod,
        },
      });

      // Delete cart after successful payment
      await db.cart.deleteMany({
        where: {
          id: cartId,
        },
      });
    }
  } catch (error) {
    console.error('Stripe payment confirmation error:', error);

    return Response.json(
      { error: 'Payment confirmation failed' },
      { status: 500 }
    );
  }

  redirect('/orders');
};