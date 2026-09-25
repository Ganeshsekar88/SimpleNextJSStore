import { render, screen } from '@testing-library/react';
import Logo from '@/components/navbar/Logo';

jest.mock('../../../components/ui/button.tsx', () => ({
  Button: ({
    children,
    size,
    asChild,
  }: {
    children: React.ReactNode;
    size?: string;
    asChild?: boolean;
  }) => (
    <div
      data-testid='logo-button'
      data-size={size}
      data-as-child={asChild}
    >
      {children}
    </div>
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

jest.mock('react-icons/vsc', () => ({
  VscCode: ({ className }: { className?: string }) => (
    <span data-testid='logo-icon' className={className}>
      Code Icon
    </span>
  ),
}));

describe('Logo', () => {
  it('renders the logo button with the icon size', () => {
    render(<Logo />);

    const button = screen.getByTestId('logo-button');

    expect(button).toHaveAttribute('data-size', 'icon');
  });

  it('renders the button with asChild enabled', () => {
    render(<Logo />);

    const button = screen.getByTestId('logo-button');

    expect(button).toHaveAttribute('data-as-child', 'true');
  });

  it('renders a link pointing to the home page', () => {
    render(<Logo />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/');
  });

  it('renders the code icon with the expected classes', () => {
    render(<Logo />);

    const icon = screen.getByTestId('logo-icon');

    expect(icon).toHaveClass('w-6', 'h-6');
  });

  it('renders the code icon inside the home link', () => {
    render(<Logo />);

    const link = screen.getByRole('link');
    const icon = screen.getByTestId('logo-icon');

    expect(link).toContainElement(icon);
  });
});