import LoadingContainer from "@/components/global/LoadingContainer";
import { render } from "@testing-library/react";



describe('LoadingContainer', () => {
  it('renders three loading product cards', () => {
    const { container } = render(<LoadingContainer />);

    const grid = container.firstElementChild;

    expect(grid?.children).toHaveLength(3);
  });

  it('renders three skeletons in each loading product', () => {
    const { container } = render(<LoadingContainer />);

    const grid = container.firstElementChild;

    expect(grid).not.toBeNull();

    Array.from(grid!.children).forEach((card) => {
      expect(card.querySelectorAll('.animate-pulse')).toHaveLength(3);
    });
  });

  it('applies the responsive grid layout classes', () => {
    const { container } = render(<LoadingContainer />);

    const grid = container.firstElementChild;

    expect(grid).toHaveClass(
      'pt-12',
      'grid',
      'gap-4',
      'md:grid-cols-2',
      'lg:grid-cols-3'
    );
  });

  it('renders the correct skeleton dimensions', () => {
    const { container } = render(<LoadingContainer />);

    const skeletons = container.querySelectorAll('.animate-pulse');

    expect(skeletons).toHaveLength(9);

    for (let i = 0; i < skeletons.length; i += 3) {
      expect(skeletons[i]).toHaveClass('h-48', 'w-full');

      expect(skeletons[i + 1]).toHaveClass(
        'h-4',
        'w-3/4',
        'mt-4'
      );

      expect(skeletons[i + 2]).toHaveClass(
        'h-4',
        'w-1/4',
        'mt-4'
      );
    }
  });
});