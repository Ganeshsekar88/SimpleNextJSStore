import { Suspense } from 'react';
import CheckoutForm from './CheckoutForm';

export default function CheckoutPage() {
  return (
      <Suspense fallback={<p>Loading...</p>}>
      <CheckoutForm />
    </Suspense>
  );
}