import { Suspense } from 'react';
import CartForm from './CartForm';

export default function CartPage  () {
  return (
      <Suspense fallback={<p>Loading...</p>}>
      <CartForm />
    </Suspense>
  );
}