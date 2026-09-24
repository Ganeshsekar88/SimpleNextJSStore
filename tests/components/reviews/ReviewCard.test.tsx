import { render, screen } from '@testing-library/react';
import ReviewCard from '@/components/reviews/ReviewCard';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
    ...props
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    [key: string]: unknown;
  }) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      {...props}
    />
  ),
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardHeader: ({ children }: any) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardContent: ({ children }: any) => (
    <div data-testid="card-content">{children}</div>
  ),
}));

jest.mock('@/components/reviews/Rating', () => ({
  __esModule: true,
  default: ({ rating }: { rating: number }) => (
    <div data-testid="rating">Rating: {rating}</div>
  ),
}));

jest.mock('@/components/reviews/Comment', () => ({
  __esModule: true,
  default: ({ comment }: { comment: string }) => (
    <div data-testid="comment">{comment}</div>
  ),
}));

describe('ReviewCard', () => {
  const reviewInfo = {
    comment: 'This product was excellent!',
    rating: 5,
    name: 'John Doe',
    image: '/images/john.jpg',
  };

  describe('rendering', () => {
    it('renders the reviewer name', () => {
      render(<ReviewCard reviewInfo={reviewInfo} />);

      expect(
        screen.getByRole('heading', { name: 'John Doe' })
      ).toBeInTheDocument();
    });

    it('renders the reviewer image with the correct attributes', () => {
      render(<ReviewCard reviewInfo={reviewInfo} />);

      const image = screen.getByRole('img', {
        name: 'John Doe',
      });

      expect(image).toHaveAttribute('src', reviewInfo.image);
      expect(image).toHaveAttribute('alt', reviewInfo.name);
      expect(image).toHaveAttribute('width', '48');
      expect(image).toHaveAttribute('height', '48');
    });

    it('renders the Rating component with the review rating', () => {
      render(<ReviewCard reviewInfo={reviewInfo} />);

      expect(screen.getByTestId('rating')).toHaveTextContent('Rating: 5');
    });

    it('renders the Comment component with the review comment', () => {
      render(<ReviewCard reviewInfo={reviewInfo} />);

      expect(screen.getByTestId('comment')).toHaveTextContent(
        'This product was excellent!'
      );
    });

    it('renders the Card structure', () => {
      render(<ReviewCard reviewInfo={reviewInfo} />);

      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByTestId('card-header')).toBeInTheDocument();
      expect(screen.getByTestId('card-content')).toBeInTheDocument();
    });
  });

  describe('children', () => {
    it('renders children when provided', () => {
      render(
        <ReviewCard reviewInfo={reviewInfo}>
          <button>Edit Review</button>
        </ReviewCard>
      );

      expect(
        screen.getByRole('button', { name: 'Edit Review' })
      ).toBeInTheDocument();
    });

    it('does not render children when they are not provided', () => {
      render(<ReviewCard reviewInfo={reviewInfo} />);

      expect(
        screen.queryByRole('button', { name: 'Edit Review' })
      ).not.toBeInTheDocument();
    });
  });

  describe('complete review information', () => {
    it('renders all review information correctly', () => {
      render(
        <ReviewCard
          reviewInfo={{
            comment: 'Amazing quality and fast delivery.',
            rating: 4,
            name: 'Jane Smith',
            image: '/images/jane.jpg',
          }}
        >
          <button>Delete Review</button>
        </ReviewCard>
      );

      expect(
        screen.getByRole('heading', { name: 'Jane Smith' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('img', { name: 'Jane Smith' })
      ).toHaveAttribute('src', '/images/jane.jpg');

      expect(screen.getByTestId('rating')).toHaveTextContent('Rating: 4');

      expect(screen.getByTestId('comment')).toHaveTextContent(
        'Amazing quality and fast delivery.'
      );

      expect(
        screen.getByRole('button', { name: 'Delete Review' })
      ).toBeInTheDocument();
    });
  });
});