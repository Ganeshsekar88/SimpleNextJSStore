import { Suspense } from 'react';
import CheckoutForm from './CheckoutForm';

export default function CheckoutPage() {
  return (
      <Suspense fallback={null}>
      <CheckoutForm />
    </Suspense>
  );
}