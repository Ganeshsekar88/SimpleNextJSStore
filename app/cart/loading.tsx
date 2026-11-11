import { Suspense } from 'react';
import { fetchCartItems } from '@/utils/actions';
import {
  CartItemsSkeleton,
  EmptyCartSkeleton,
} from '@/components/cart/CartPageSkeleton';

export default function Loading() {
  return (
    <Suspense fallback={<CartItemsSkeleton />}>
      <ConditionalCartSkeleton />
    </Suspense>
  );
}

async function ConditionalCartSkeleton() {
  const itemCount = await fetchCartItems();
  return itemCount === 0 ? <EmptyCartSkeleton /> : <CartItemsSkeleton />;
}
