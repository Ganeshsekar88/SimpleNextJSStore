import { render, screen } from '@testing-library/react';
import LinksDropdown from '@/components/navbar/LinksDropDown';
import { auth } from '@clerk/nextjs/server';
import { links } from '@/utils/link';

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
}));

/*
 * We control Clerk's authentication state ourselves.
 * This prevents Clerk internals from running while still allowing
 * the component's SignedIn/SignedOut branches to be tested.
 */
let isSignedIn = false;

jest.mock('@clerk/nextjs', () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),

  SignUpButton: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),

  SignedIn: ({ children }: { children: React.ReactNode }) =>
    isSignedIn ? <>{children}</> : null,

  SignedOut: ({ children }: { children: React.ReactNode }) =>
    isSignedIn ? null : <>{children}</>,
}));

jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='dropdown-menu'>{children}</div>
  ),

  DropdownMenuTrigger: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid='dropdown-menu-trigger'>{children}</div>,

  DropdownMenuContent: ({
    children,
    className,
    align,
    sideOffset,
  }: {
    children: React.ReactNode;
    className?: string;
    align?: string;
    sideOffset?: number;
  }) => (
    <div
      data-testid='dropdown-menu-content'
      className={className}
      data-align={align}
      data-side-offset={sideOffset}
    >
      {children}
    </div>
  ),

  DropdownMenuItem: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid='dropdown-menu-item'>{children}</div>,

  DropdownMenuSeparator: () => (
    <div data-testid='dropdown-menu-separator' />
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    variant,
    className,
  }: {
    children: React.ReactNode;
    variant?: string;
    className?: string;
  }) => (
    <button
      data-testid='menu-button'
      data-variant={variant}
      className={className}
    >
      {children}
    </button>
  ),
}));

jest.mock('@/components/navbar/UserIcon', () => ({
  __esModule: true,
  default: () => <span data-testid='user-icon'>User Icon</span>,
}));

jest.mock('@/components/navbar/SignOutLink', () => ({
  __esModule: true,
  default: () => <span data-testid='sign-out-link'>Sign Out</span>,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
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
}));

jest.mock('react-icons/lu', () => ({
  LuAlignLeft: ({ className }: { className?: string }) => (
    <span data-testid='align-left-icon' className={className}>
      Align Left
    </span>
  ),
}));

jest.mock('@/utils/link', () => ({
  links: [
    { label: 'home', href: '/' },
    { label: 'products', href: '/products' },
    { label: 'dashboard', href: '/dashboard' },
  ],
}));

const mockedAuth = auth as jest.MockedFunction<typeof auth>;

describe('LinksDropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    isSignedIn = false;
    process.env.ADMIN_USER_ID = 'admin-user';
  });

  afterEach(() => {
    delete process.env.ADMIN_USER_ID;
  });

  describe('trigger', () => {
    it('renders the menu button with the outline variant', () => {
      mockedAuth.mockReturnValue({
        userId: null,
      } as ReturnType<typeof auth>);

      render(<LinksDropdown />);

      expect(screen.getByTestId('menu-button')).toHaveAttribute(
        'data-variant',
        'outline',
      );
    });

    it('renders the expected button classes', () => {
      mockedAuth.mockReturnValue({
        userId: null,
      } as ReturnType<typeof auth>);

      render(<LinksDropdown />);

      expect(screen.getByTestId('menu-button')).toHaveClass(
        'flex',
        'gap-4',
        'max-w-[100px]',
      );
    });

    it('renders the menu and user icons inside the trigger', () => {
      mockedAuth.mockReturnValue({
        userId: null,
      } as ReturnType<typeof auth>);

      render(<LinksDropdown />);

      expect(screen.getByTestId('align-left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    });
  });

  describe('dropdown content', () => {
    it('renders the expected dropdown content configuration', () => {
      mockedAuth.mockReturnValue({
        userId: null,
      } as ReturnType<typeof auth>);

      render(<LinksDropdown />);

      const content = screen.getByTestId('dropdown-menu-content');

      expect(content).toHaveClass('w-48');
      expect(content).toHaveAttribute('data-align', 'start');
      expect(content).toHaveAttribute('data-side-offset', '10');
    });
  });

  describe('signed-out user', () => {
    beforeEach(() => {
      isSignedIn = false;

      mockedAuth.mockReturnValue({
        userId: null,
      } as ReturnType<typeof auth>);
    });

    it('renders Login and Register links with the correct destinations', () => {
      render(<LinksDropdown />);

      expect(
        screen.getByRole('link', { name: 'Login' }),
      ).toHaveAttribute('href', '/login');

      expect(
        screen.getByRole('link', { name: 'Register' }),
      ).toHaveAttribute('href', '/register');
    });

    it('renders exactly two authentication menu items separated by one separator', () => {
      render(<LinksDropdown />);

      expect(screen.getAllByTestId('dropdown-menu-item')).toHaveLength(2);
      expect(
        screen.getAllByTestId('dropdown-menu-separator'),
      ).toHaveLength(1);
    });

    it('does not render signed-in navigation or sign-out', () => {
      render(<LinksDropdown />);

      expect(
        screen.queryByRole('link', { name: 'home' }),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole('link', { name: 'products' }),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole('link', { name: 'dashboard' }),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByTestId('sign-out-link'),
      ).not.toBeInTheDocument();
    });
  });

  describe('signed-in non-admin user', () => {
    beforeEach(() => {
      isSignedIn = true;

      mockedAuth.mockReturnValue({
        userId: 'regular-user',
      } as ReturnType<typeof auth>);
    });

    it('renders all configured non-dashboard links with their correct hrefs', () => {
      render(<LinksDropdown />);

      links
        .filter((link) => link.label !== 'dashboard')
        .forEach((link) => {
          expect(
            screen.getByRole('link', {
              name: link.label,
            }),
          ).toHaveAttribute('href', link.href);
        });
    });

    it('does not render the dashboard link', () => {
      render(<LinksDropdown />);

      expect(
        screen.queryByRole('link', {
          name: 'dashboard',
        }),
      ).not.toBeInTheDocument();
    });

    it('renders the sign-out action', () => {
      render(<LinksDropdown />);

      expect(
        screen.getByTestId('sign-out-link'),
      ).toBeInTheDocument();
    });

    it('renders the navigation links followed by a separator and sign-out action', () => {
      render(<LinksDropdown />);

      expect(
        screen.getAllByTestId('dropdown-menu-separator'),
      ).toHaveLength(1);

      expect(
        screen.getByTestId('sign-out-link'),
      ).toBeInTheDocument();
    });
  });

  describe('signed-in admin user', () => {
    beforeEach(() => {
      isSignedIn = true;

      mockedAuth.mockReturnValue({
        userId: 'admin-user',
      } as ReturnType<typeof auth>);
    });

    it('renders the dashboard link', () => {
      render(<LinksDropdown />);

      expect(
        screen.getByRole('link', {
          name: 'dashboard',
        }),
      ).toHaveAttribute('href', '/dashboard');
    });

    it('renders every configured navigation link', () => {
      render(<LinksDropdown />);

      links.forEach((link) => {
        expect(
          screen.getByRole('link', {
            name: link.label,
          }),
        ).toHaveAttribute('href', link.href);
      });
    });

    it('renders the sign-out action', () => {
      render(<LinksDropdown />);

      expect(
        screen.getByTestId('sign-out-link'),
      ).toBeInTheDocument();
    });

    it('renders one separator before the sign-out action', () => {
      render(<LinksDropdown />);

      expect(
        screen.getAllByTestId('dropdown-menu-separator'),
      ).toHaveLength(1);
    });
  });
});