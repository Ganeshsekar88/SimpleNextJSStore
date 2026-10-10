import { Suspense } from 'react';
import CartForm from './CartForm';
import LoadingContainer from '@/components/global/LoadingContainer';

export default function CartPage  () {
  return (
      <Suspense fallback={<LoadingContainer />}>
      <CartForm />
    </Suspense>
  );
}