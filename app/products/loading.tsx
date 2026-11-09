'use client';

import { Suspense } from 'react';
import { ProductsPageSkeleton } from '@/components/products/ProductsPageSkeleton';
import { useSearchParams } from 'next/navigation';

function ProductsLoadingMode() {
  const searchParams = useSearchParams();
  const layout = searchParams.get('layout') === 'list' ? 'list' : 'grid';

  return <ProductsPageSkeleton layout={layout} />;
}

function Loading() {
  return (
    <Suspense fallback={<ProductsPageSkeleton layout='grid' />}>
      <ProductsLoadingMode />
    </Suspense>
  );
}

export default Loading;
