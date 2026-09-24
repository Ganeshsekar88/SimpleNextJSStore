
import { render, screen } from '@testing-library/react';
import ProductRating from '@/components/single-product/ProductRating';
import { fetchProductRating } from '@/utils/actions';

jest.mock('@/utils/actions', () => ({
  fetchProductRating: jest.fn(),
}));

jest.mock('react-icons/fa', () => ({
  FaStar: () => <span data-testid="star-icon" />,
}));

describe('ProductRating', () => {
  const productId = 'product-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls fetchProductRating with the correct product ID', async () => {
    (fetchProductRating as jest.Mock).mockResolvedValue({
      rating: 4.5,
      count: 25,
    });

    const component = await ProductRating({ productId });

    render(component);

    expect(fetchProductRating).toHaveBeenCalledWith(productId);
  });

  it('renders the star icon', async () => {
    (fetchProductRating as jest.Mock).mockResolvedValue({
      rating: 4.5,
      count: 25,
    });

    const component = await ProductRating({ productId });

    render(component);

    expect(screen.getByTestId('star-icon')).toBeInTheDocument();
  });

  it('renders the rating and review count together', async () => {
    (fetchProductRating as jest.Mock).mockResolvedValue({
      rating: 4,
      count: 10,
    });

    const component = await ProductRating({ productId });

    render(component);

    expect(
      screen.getByText('4 (10) reviews')
    ).toBeInTheDocument();
  });
});