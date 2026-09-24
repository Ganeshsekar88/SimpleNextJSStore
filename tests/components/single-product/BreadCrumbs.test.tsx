
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BreadCrumbs from '@/components/single-product/BreadCrumbs';

jest.mock('@/components/ui/breadcrumb', () => ({
  Breadcrumb: ({ children }: { children: React.ReactNode }) => (
    <nav aria-label='breadcrumb'>{children}</nav>
  ),

  BreadcrumbList: ({ children }: { children: React.ReactNode }) => (
    <ol>{children}</ol>
  ),

  BreadcrumbItem: ({ children }: { children: React.ReactNode }) => (
    <li>{children}</li>
  ),

  BreadcrumbLink: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),

  BreadcrumbPage: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <span
      role='link'
      aria-disabled='true'
      aria-current='page'
      className={className}
    >
      {children}
    </span>
  ),

  BreadcrumbSeparator: () => (
    <li role='presentation' aria-hidden='true'>
      <span data-testid='breadcrumb-separator'>›</span>
    </li>
  ),
}));

describe('BreadCrumbs', () => {
  const productName = 'iPhone 15';

  beforeEach(() => {
    render(<BreadCrumbs name={productName} />);
  });

  describe('breadcrumb content', () => {
    it('renders the home breadcrumb', () => {
      expect(
        screen.getByRole('link', { name: /home/i })
      ).toBeInTheDocument();
    });

    it('renders the products breadcrumb', () => {
      expect(
        screen.getByRole('link', { name: /products/i })
      ).toBeInTheDocument();
    });

    it('renders the provided name as the current page', () => {
      expect(
        screen.getByRole('link', {
          name: productName,
          current: 'page',
        })
      ).toBeInTheDocument();
    });
  });

  describe('breadcrumb navigation', () => {
    it('provides a link to the home page', () => {
      const homeLink = screen.getByRole('link', {
        name: /home/i,
      });

      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('provides a link to the products page', () => {
      const productsLink = screen.getByRole('link', {
        name: /products/i,
      });

      expect(productsLink).toHaveAttribute('href', '/products');
    });
  });

  describe('breadcrumb separators', () => {
    it('renders exactly two separators', () => {
      const separators = screen.getAllByTestId('breadcrumb-separator');

      expect(separators).toHaveLength(2);
    });
  });

  describe('breadcrumb structure', () => {
    it('renders the breadcrumb navigation landmark', () => {
      expect(
        screen.getByRole('navigation', { name: /breadcrumb/i })
      ).toBeInTheDocument();
    });

    it('renders the breadcrumb list', () => {
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('marks the product name as the current page', () => {
      const currentPage = screen.getByRole('link', {
        name: productName,
        current: 'page',
      });

      expect(currentPage).toHaveAttribute('aria-current', 'page');
      expect(currentPage).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('link interaction', () => {
    it('allows the user to activate the home link', async () => {
      const user = userEvent.setup();

      const homeLink = screen.getByRole('link', {
        name: /home/i,
      });

      await user.click(homeLink);

      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('allows the user to activate the products link', async () => {
      const user = userEvent.setup();

      const productsLink = screen.getByRole('link', {
        name: /products/i,
      });

      await user.click(productsLink);

      expect(productsLink).toHaveAttribute('href', '/products');
    });
  });
});
