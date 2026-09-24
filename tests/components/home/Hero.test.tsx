
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Hero from '@/components/home/Hero';

jest.mock('@/components/home/HeroCarousel', () => {
  return function MockHeroCarousel() {
    return <div data-testid='hero-carousel'>Hero Carousel</div>;
  };
});

describe('Hero', () => {
  it('renders the main heading', () => {
    render(<Hero />);

    expect(
      screen.getByRole('heading', {
        name: /we are changing the way people shop/i,
      })
    ).toBeInTheDocument();
  });

  it('renders the hero description', () => {
    render(<Hero />);

    expect(
      screen.getByText(
        /lorem ipsum dolor sit amet consectetur adipisicing elit/i
      )
    ).toBeInTheDocument();
  });

  it('renders the products link with the correct href', () => {
    render(<Hero />);

    const productsLink = screen.getByRole('link', {
      name: /our products/i,
    });

    expect(productsLink).toBeInTheDocument();
    expect(productsLink).toHaveAttribute('href', '/products');
  });

  it('renders the hero carousel', () => {
    render(<Hero />);

    expect(screen.getByTestId('hero-carousel')).toBeInTheDocument();
  });
});
