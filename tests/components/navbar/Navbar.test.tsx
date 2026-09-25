import { render, screen } from '@testing-library/react';
import Navbar from '@/components/navbar/Navbar';

jest.mock('@/components/global/Container', () => {
  return function MockContainer({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <div data-testid="container" className={className}>
        {children}
      </div>
    );
  };
});

jest.mock('@/components/navbar/Logo', () => {
  return function MockLogo() {
    return <div data-testid="logo">Logo</div>;
  };
});

jest.mock('@/components/navbar/NavSearch', () => {
  return function MockNavSearch() {
    return <div data-testid="nav-search">Nav Search</div>;
  };
});

jest.mock('@/components/navbar/CartButton', () => {
  return function MockCartButton() {
    return <div data-testid="cart-button">Cart Button</div>;
  };
});

jest.mock('@/components/navbar/DarkMode', () => {
  return function MockDarkMode() {
    return <div data-testid="dark-mode">Dark Mode</div>;
  };
});

jest.mock('@/components/navbar/LinksDropDown', () => {
  return function MockLinksDropDown() {
    return <div data-testid="links-dropdown">Links Dropdown</div>;
  };
});

describe('Navbar', () => {
  it('renders the navbar and all of its child components', () => {
    render(<Navbar />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('container')).toBeInTheDocument();

    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('nav-search')).toBeInTheDocument();
    expect(screen.getByTestId('cart-button')).toBeInTheDocument();
    expect(screen.getByTestId('dark-mode')).toBeInTheDocument();
    expect(screen.getByTestId('links-dropdown')).toBeInTheDocument();
  });

  it('renders the child components in the expected order', () => {
    render(<Navbar />);

    const container = screen.getByTestId('container');

    const children = Array.from(container.children);

    expect(children[0]).toHaveAttribute('data-testid', 'logo');
    expect(children[1]).toHaveAttribute('data-testid', 'nav-search');

    const actions = children[2];

    expect(actions).toHaveAttribute('class', 'flex gap-4 items-center');

    expect(actions.children[0]).toHaveAttribute(
      'data-testid',
      'cart-button'
    );
    expect(actions.children[1]).toHaveAttribute(
      'data-testid',
      'dark-mode'
    );
    expect(actions.children[2]).toHaveAttribute(
      'data-testid',
      'links-dropdown'
    );
  });

  it('applies the expected layout classes to the Container', () => {
    render(<Navbar />);

    expect(screen.getByTestId('container')).toHaveClass(
      'flex',
      'flex-col',
      'sm:flex-row',
      'sm:justify-between',
      'sm:items-center',
      'flex-wrap',
      'py-8',
      'gap-4'
    );
  });

  it('applies the expected classes to the actions container', () => {
    render(<Navbar />);

    const actions = screen.getByTestId('cart-button').parentElement;

    expect(actions).toHaveClass('flex', 'gap-4', 'items-center');
  });

  it('renders NavSearch successfully through Suspense', () => {
    render(<Navbar />);

    expect(screen.getByTestId('nav-search')).toBeInTheDocument();
  });
});