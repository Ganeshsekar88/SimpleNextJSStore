import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
import { type NextRequest } from 'next/server';
import db from '@/utils/db';

export const POST = async (req: NextRequest) => {
  const requestHeaders = new Headers(req.headers);
  // console.log('request headers of payemnt post request initiatd from checkout page', requestHeaders);
  const origin = requestHeaders.get('origin');
    // console.log('origin of payemnt post request initiated from checkout page', origin);

  const { orderId, cartId } = await req.json();

  const order = await db.order.findUnique({
    where: {
      id: orderId,
    },
  });
  const cart = await db.cart.findUnique({
    where: {
      id: cartId,
    },
    include: {
      cartItems: {
        include: {
          product: true,
        },
      },
    },
  });

  // console.log('order to be processed from the payment router    ', order);
  // console.log('cart to be processed from the payment router', cart);
  if (!order || !cart) {
    return Response.json(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }
  try {
    let taxRateId: string | undefined;

    if (cart.tax > 0 && cart.cartTotal > 0) {
      const percentage = cart.taxRate * 100;
      const { data: taxRates } = await stripe.taxRates.list({
        active: true,
        limit: 100,
      });
      const existingTaxRate = taxRates.find(
        (taxRate) =>
          taxRate.display_name === 'Tax' &&
          !taxRate.inclusive &&
          Math.abs(taxRate.percentage - percentage) < 0.0001
      );
      const taxRate =
        existingTaxRate ??
        (await stripe.taxRates.create({
          display_name: 'Tax',
          inclusive: false,
          percentage,
        }));

      taxRateId = taxRate.id;
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      cart.cartItems.map((cartItem) => ({
        quantity: cartItem.amount,
        price_data: {
          currency: 'usd',
          product_data: {
            name: cartItem.product.name,
            images: [cartItem.product.image],
          },
          unit_amount: cartItem.product.price * 100, // price in cents
        },
        ...(taxRateId ? { tax_rates: [taxRateId] } : {}),
      }));

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded_page',
      metadata: { orderId, cartId },
      line_items: line_items,
      ...(cart.shipping > 0
        ? {
            shipping_options: [
              {
                shipping_rate_data: {
                  type: 'fixed_amount',
                  display_name: 'Shipping',
                  fixed_amount: {
                    amount: cart.shipping * 100,
                    currency: 'usd',
                  },
                },
              },
            ],
          }
        : {}),
      mode: 'payment',
      return_url: `${origin}/api/confirm?session_id={CHECKOUT_SESSION_ID}`, 
    });

    // console.log("=========================================================================");
    // console.log('stripe checkout session returned as output:',session);
    
    // console.log("=========================================================================");

    // console.log('stripe checkout session returned client secret:',session,  session.client_secret);

    return Response.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.log(error);

    return Response.json(null, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
};
