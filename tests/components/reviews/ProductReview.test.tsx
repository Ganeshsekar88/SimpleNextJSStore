import { render, screen } from '@testing-library/react';
import ProductReviews from '@/components/reviews/ProductReview';
import { fetchProductReviews } from '@/utils/actions';

jest.mock('@/utils/actions', () => ({
  fetchProductReviews: jest.fn(),
}));

jest.mock('@/components/reviews/ReviewCard', () => ({
  __esModule: true,
  default: ({
    reviewInfo,
  }: {
    reviewInfo: {
      comment: string;
      rating: number;
      image: string;
      name: string;
    };
  }) => (
    <div data-testid="review-card">
      <span>{reviewInfo.name}</span>
      <span>{reviewInfo.comment}</span>
      <span>{reviewInfo.rating}</span>
      <span>{reviewInfo.image}</span>
    </div>
  ),
}));

jest.mock('@/components/global/SectionTitle', () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => (
    <h2 data-testid="section-title">{text}</h2>
  ),
}));

const mockedFetchProductReviews =
  fetchProductReviews as jest.MockedFunction<typeof fetchProductReviews>;

describe('ProductReviews', () => {
  const productId = 'product-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders the section title', async () => {
      mockedFetchProductReviews.mockResolvedValue([
        {
          id: 'review-1',
          clerkId: 'clerk-1',
          comment: 'Great product!',
          rating: 5,
          authorName: 'John Doe',
          authorImageUrl: '/john.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
          productId,
        },
      ]);

      render(await ProductReviews({ productId }));

      expect(screen.getByTestId('section-title')).toHaveTextContent(
        'product reviews'
      );
    });

    it('renders the reviews container with the expected classes', async () => {
      mockedFetchProductReviews.mockResolvedValue([
        {
          id: 'review-1',
          clerkId: 'clerk-1',
          comment: 'Great product!',
          rating: 5,
          authorName: 'John Doe',
          authorImageUrl: '/john.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
          productId,
        },
      ]);

      const { container } = render(await ProductReviews({ productId }));

      const reviewsContainer = container.querySelector(
        '.grid.md\\:grid-cols-2.gap-8.my-8'
      );

      expect(reviewsContainer).toBeInTheDocument();
    });

    it('renders the outer container with the expected class', async () => {
      mockedFetchProductReviews.mockResolvedValue([]);

      const { container } = render(await ProductReviews({ productId }));

      expect(container.firstChild).toHaveClass('mt-16');
    });
  });

  describe('fetchProductReviews', () => {
    it('fetches reviews using the provided product id', async () => {
      mockedFetchProductReviews.mockResolvedValue([]);

      await ProductReviews({ productId });

      expect(mockedFetchProductReviews).toHaveBeenCalledWith(productId);
    });
  });

  describe('reviews', () => {
    it('renders a ReviewCard for each review', async () => {
      mockedFetchProductReviews.mockResolvedValue([
        {
          id: 'review-1',
          clerkId: 'clerk-1',
          comment: 'Excellent product!',
          rating: 5,
          authorName: 'John Doe',
          authorImageUrl: '/john.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
          productId,
        },
        {
          id: 'review-2',
          clerkId: 'clerk-2',
          comment: 'Good quality.',
          rating: 4,
          authorName: 'Jane Smith',
          authorImageUrl: '/jane.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
          productId,
        },
      ]);

      render(await ProductReviews({ productId }));

      expect(screen.getAllByTestId('review-card')).toHaveLength(2);
    });

    it('passes the correct review information to ReviewCard', async () => {
      mockedFetchProductReviews.mockResolvedValue([
        {
          id: 'review-1',
          clerkId: 'clerk-1',
          comment: 'Excellent product!',
          rating: 5,
          authorName: 'John Doe',
          authorImageUrl: '/john.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
          productId,
        },
      ]);

      render(await ProductReviews({ productId }));

      const reviewCard = screen.getByTestId('review-card');

      expect(reviewCard).toHaveTextContent('John Doe');
      expect(reviewCard).toHaveTextContent('Excellent product!');
      expect(reviewCard).toHaveTextContent('5');
      expect(reviewCard).toHaveTextContent('/john.jpg');
    });

    it('renders no ReviewCards when there are no reviews', async () => {
      mockedFetchProductReviews.mockResolvedValue([]);

      render(await ProductReviews({ productId }));

      expect(screen.queryByTestId('review-card')).not.toBeInTheDocument();
    });
  });
});