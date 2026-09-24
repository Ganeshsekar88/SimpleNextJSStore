import { render, screen } from '@testing-library/react';
import Container from '@/components/global/Container';

describe('Container', () => {
  it('renders children correctly', () => {
    render(
      <Container>
        <span>Test content</span>
      </Container>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies the default container classes', () => {
    const { container } = render(
      <Container>
        <span>Content</span>
      </Container>
    );

    const element = container.firstChild;

    expect(element).toHaveClass(
      'mx-auto',
      'max-w-6xl',
      'xl:max-w-7xl',
      'px-8'
    );
  });

  it('merges custom className with the default classes', () => {
    const { container } = render(
      <Container className="bg-red-500">
        <span>Content</span>
      </Container>
    );

    const element = container.firstChild;

    expect(element).toHaveClass(
      'mx-auto',
      'max-w-6xl',
      'xl:max-w-7xl',
      'px-8',
      'bg-red-500'
    );
  });
});