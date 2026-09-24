import { render, screen } from '@testing-library/react';
import HeroCarousel from '@/components/home/HeroCarousel';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} />
  ),
}));

jest.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => (
    <div
      role="region"
      aria-roledescription="carousel"
    >
      {children}
    </div>
  ),

  CarouselContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),

  CarouselItem: ({ children }: { children: React.ReactNode }) => (
    <div
      role="group"
      aria-roledescription="slide"
    >
      {children}
    </div>
  ),

  CarouselPrevious: () => (
    <button type="button">
      <span>Previous slide</span>
    </button>
  ),

  CarouselNext: () => (
    <button type="button">
      <span>Next slide</span>
    </button>
  ),
}));

describe('HeroCarousel', () => {
  it('renders the carousel container', () => {
    const { container } = render(<HeroCarousel />);

    expect(container.firstChild).toHaveClass(
      'hidden',
      'lg:block'
    );
  });

  it('renders all four hero images', () => {
    render(<HeroCarousel />);

    const images = screen.getAllByRole('img', {
      name: 'hero',
    });

    expect(images).toHaveLength(4);
  });

  it('renders four carousel slides', () => {
    render(<HeroCarousel />);

    const slides = screen.getAllByRole('group');

    expect(slides).toHaveLength(4);
  });

  it('renders previous and next carousel controls', () => {
    render(<HeroCarousel />);

    expect(
      screen.getByRole('button', {
        name: /previous slide/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /next slide/i,
      })
    ).toBeInTheDocument();
  });

  it('renders each hero image inside a carousel slide', () => {
    render(<HeroCarousel />);

    const slides = screen.getAllByRole('group');

    slides.forEach((slide) => {
      expect(slide.querySelector('img')).toBeInTheDocument();
    });
  });

  it('applies the expected classes to hero images', () => {
    render(<HeroCarousel />);

    const images = screen.getAllByRole('img');

    images.forEach((image) => {
      expect(image).toHaveClass(
        'w-full',
        'h-[24rem]',
        'rounded-md',
        'object-cover'
      );
    });
  });
});