import { render, screen } from '@testing-library/react';
import EmptyList from '@/components/global/EmptyList';

describe('EmptyList', () => {
  it('renders the default heading', () => {
    render(<EmptyList />);

    expect(screen.getByRole('heading', { name: 'No items found.' })).toBeInTheDocument();
  });

  it('renders a custom heading', () => {
    render(<EmptyList heading="No products found." />);

    expect(
      screen.getByRole('heading', { name: 'No products found.' })
    ).toBeInTheDocument();
  });

  it('applies the default class', () => {
    render(<EmptyList />);

    const heading = screen.getByRole('heading');

    expect(heading).toHaveClass('text-xl');
  });

  it('merges a custom className with the default class', () => {
    render(<EmptyList className="text-red-500" />);

    const heading = screen.getByRole('heading');

    expect(heading).toHaveClass('text-xl', 'text-red-500');
  });
});