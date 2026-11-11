import { deleteReviewAction, fetchProductReviewsByUser } from '@/utils/actions';
import ReviewCard from '@/components/reviews/ReviewCard';
import SectionTitle from '@/components/global/SectionTitle';
import FormContainer from '@/components/form/FormContainer';
import { IconButton } from '@/components/form/IconButton';
import PaginationControls from '@/components/admin/PaginationControls';
import { REVIEWS_PAGE_SIZE } from '@/utils/pagination';
import { redirect } from 'next/navigation';

async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const { page } = await searchParams;
  const pageValue = Array.isArray(page) ? page[0] : page;
  const requestedPage = Number.parseInt(pageValue ?? '1', 10);
  const data = await fetchProductReviewsByUser(requestedPage);
  const { reviews, totalItems, currentPage, totalPages } = data;
  if (requestedPage !== currentPage) {
    redirect(currentPage === 1 ? '/reviews' : `/reviews?page=${currentPage}`);
  }

  if (reviews.length === 0)
    return <SectionTitle text='you have no reviews yet' />;

  return (
    <>
      <SectionTitle text='Your Reviews' />
      <section className='grid md:grid-cols-2 gap-8 mt-4'>
        {reviews.map((review) => {
          const { comment, rating } = review;
          const { name, image } = review.product;
          const reviewInfo = {
            comment,
            rating,
            name,
            image,
          };
          return (
            <ReviewCard key={review.id} reviewInfo={reviewInfo}>
              <DeleteReview reviewId={review.id} />
            </ReviewCard>
          );
        })}
      </section>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={REVIEWS_PAGE_SIZE}
        href='/reviews'
        itemLabel='reviews'
      />
    </>
  );
}

const DeleteReview = ({ reviewId }: { reviewId: string }) => {
  const deleteReview = deleteReviewAction.bind(null, { reviewId });
  return (
    <FormContainer action={deleteReview}>
      <IconButton actionType='delete' />
    </FormContainer>
  );
};

export default ReviewsPage;
