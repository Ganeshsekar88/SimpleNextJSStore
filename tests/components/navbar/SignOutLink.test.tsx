import { render, screen, fireEvent } from '@testing-library/react';
import SignOutLink from '@/components/navbar/SignOutLink';
import { useToast } from '@/components/ui/use-toast';

const mockToast = jest.fn();

jest.mock('@/components/ui/use-toast', () => ({
  useToast: jest.fn(),
}));

jest.mock('@clerk/nextjs', () => ({
  SignOutButton: ({
    children,
    redirectUrl,
  }: {
    children: React.ReactNode;
    redirectUrl: string;
  }) => (
    <div data-testid='sign-out-button' data-redirect-url={redirectUrl}>
      {children}
    </div>
  ),
}));

describe('SignOutLink', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });
  });

  it('renders the Logout button', () => {
    render(<SignOutLink />);

    expect(
      screen.getByRole('button', { name: 'Logout' })
    ).toBeInTheDocument();
  });

  it('passes the root path as the redirect URL to SignOutButton', () => {
    render(<SignOutLink />);

    expect(screen.getByTestId('sign-out-button')).toHaveAttribute(
      'data-redirect-url',
      '/'
    );
  });

  it('applies the expected classes to the Logout button', () => {
    render(<SignOutLink />);

    expect(screen.getByRole('button', { name: 'Logout' })).toHaveClass(
      'w-full',
      'text-left'
    );
  });

  it('shows the logging out toast when Logout is clicked', () => {
    render(<SignOutLink />);

    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    expect(mockToast).toHaveBeenCalledTimes(1);
    expect(mockToast).toHaveBeenCalledWith({
      description: 'Logging Out...',
    });
  });
});