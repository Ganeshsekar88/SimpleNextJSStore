import FeaturedProducts from '@/components/home/FeaturedProducts';
import Hero from '@/components/home/Hero';
import LoadingContainer from '@/components/global/LoadingContainer';
import { Suspense } from 'react';

function HomPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  return (
    <>
      <Hero />
      <Suspense fallback={<LoadingContainer />}>
        <FeaturedProducts searchParams={searchParams} />
      </Suspense>
    </>
  );
}
export default HomPage;
