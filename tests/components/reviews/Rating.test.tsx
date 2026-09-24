
import { render, screen } from '@testing-library/react';
import Rating from '@/components/reviews/Rating';

jest.mock('react-icons/fa', () => ({
  FaStar: ({ className }: { className?: string }) => (
    <span data-testid="filled-star" className={className} />
  ),
  FaRegStar: ({ className }: { className?: string }) => (
    <span data-testid="empty-star" className={className} />
  ),
}));

describe('Rating', () => {
  describe('rendering', () => {
    it('renders five stars', () => {
      render(<Rating rating={3} />);

      const filledStars = screen.getAllByTestId('filled-star');
      const emptyStars = screen.getAllByTestId('empty-star');

      expect(filledStars.length + emptyStars.length).toBe(5);
    });

    it('renders the correct number of filled stars', () => {
      render(<Rating rating={3} />);

      expect(screen.getAllByTestId('filled-star')).toHaveLength(3);
    });

    it('renders the correct number of empty stars', () => {
      render(<Rating rating={3} />);

      expect(screen.getAllByTestId('empty-star')).toHaveLength(2);
    });
  });

  describe('rating values', () => {
    it('renders five filled stars for a rating of 5', () => {
      render(<Rating rating={5} />);

      expect(screen.getAllByTestId('filled-star')).toHaveLength(5);
      expect(screen.queryAllByTestId('empty-star')).toHaveLength(0);
    });

    it('renders four filled stars and one empty star for a rating of 4', () => {
      render(<Rating rating={4} />);

      expect(screen.getAllByTestId('filled-star')).toHaveLength(4);
      expect(screen.getAllByTestId('empty-star')).toHaveLength(1);
    });

    it('renders three filled stars and two empty stars for a rating of 3', () => {
      render(<Rating rating={3} />);

      expect(screen.getAllByTestId('filled-star')).toHaveLength(3);
      expect(screen.getAllByTestId('empty-star')).toHaveLength(2);
    });

    it('renders two filled stars and three empty stars for a rating of 2', () => {
      render(<Rating rating={2} />);

      expect(screen.getAllByTestId('filled-star')).toHaveLength(2);
      expect(screen.getAllByTestId('empty-star')).toHaveLength(3);
    });

    it('renders one filled star and four empty stars for a rating of 1', () => {
      render(<Rating rating={1} />);

      expect(screen.getAllByTestId('filled-star')).toHaveLength(1);
      expect(screen.getAllByTestId('empty-star')).toHaveLength(4);
    });

    it('renders five empty stars for a rating of 0', () => {
      render(<Rating rating={0} />);

      expect(screen.queryAllByTestId('filled-star')).toHaveLength(0);
      expect(screen.getAllByTestId('empty-star')).toHaveLength(5);
    });
  });

  describe('star styling', () => {
    it('applies the correct classes to filled stars', () => {
      render(<Rating rating={2} />);

      const filledStars = screen.getAllByTestId('filled-star');

      filledStars.forEach((star) => {
        expect(star).toHaveClass('w-3', 'h-3', 'text-primary');
      });
    });

    it('applies the correct classes to empty stars', () => {
      render(<Rating rating={2} />);

      const emptyStars = screen.getAllByTestId('empty-star');

      emptyStars.forEach((star) => {
        expect(star).toHaveClass('w-3', 'h-3', 'text-gray-400');
      });
    });

    it('renders the rating container with the expected classes', () => {
      const { container } = render(<Rating rating={3} />);

      expect(container.firstChild).toHaveClass(
        'flex',
        'items-center',
        'gap-x-1'
      );
    });
  });
});
