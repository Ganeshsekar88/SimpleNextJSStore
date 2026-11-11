import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Rating from './Rating';
import Comment from './Comment';
import Image from 'next/image';

type ReviewCardProps = {
  reviewInfo: {
    comment: string;
    rating: number;
    name: string;
    image: string;
  };
  children?: React.ReactNode;
};

function ReviewCard({ reviewInfo, children }: ReviewCardProps) {
  return (
    <Card className='relative min-w-0 overflow-hidden'>
      <CardHeader className='p-4 sm:p-6'>
        <div className='flex min-w-0 items-center gap-4 pr-10'>
          <Image
            src={reviewInfo.image}
            alt={reviewInfo.name}
            width={48}
            height={48}
            className='size-12 shrink-0 rounded-full object-cover'
          />
          <div className='min-w-0'>
            <h3 className='mb-1 break-words text-sm font-bold capitalize'>
              {reviewInfo.name}
            </h3>
            <Rating rating={reviewInfo.rating} />
          </div>
        </div>
      </CardHeader>
      <CardContent className='px-4 pb-4 sm:px-6 sm:pb-6'>
        <Comment comment={reviewInfo.comment} />
      </CardContent>
      <div className='absolute top-3 right-3'>{children}</div>
    </Card>
  );
}
export default ReviewCard;
