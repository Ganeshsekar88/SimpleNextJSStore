import { Suspense } from 'react';

import SingleProductContent from './SingleProductContent';

function ProductSkeleton() {
  return (
    <div className="p-8 animate-pulse">
      <div className="h-8 w-48 bg-muted rounded mb-6" />
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="h-96 bg-muted rounded" />
        <div className="h-96 bg-muted rounded" />
      </div>
    </div>
  );
}

export default function SingleProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <SingleProductContent params={params} />
    </Suspense>
  );
}