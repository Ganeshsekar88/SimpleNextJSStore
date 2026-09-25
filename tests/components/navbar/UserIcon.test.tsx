import { render, screen } from '@testing-library/react';
import { currentUser } from '@clerk/nextjs/server';
import UserIcon from '@/components/navbar/UserIcon';

jest.mock('@clerk/nextjs/server', () => ({
  currentUser: jest.fn(),
}));

jest.mock('react-icons/lu', () => ({
  LuUser: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid='user-icon' {...props} />
  ),
}));

describe('UserIcon', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the user profile image when the user has an imageUrl', async () => {
    (currentUser as jest.Mock).mockResolvedValue({
      imageUrl: 'https://example.com/profile.jpg',
    });

    render(await UserIcon());

    const image = screen.getByRole('img', { name: 'user-icon' });

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      'src',
      'https://example.com/profile.jpg'
    );
  });

  it('applies the expected classes to the profile image', async () => {
    (currentUser as jest.Mock).mockResolvedValue({
      imageUrl: 'https://example.com/profile.jpg',
    });

    render(await UserIcon());

    expect(screen.getByRole('img', { name: 'user-icon' })).toHaveClass(
      'w-6',
      'h-6',
      'rounded-full',
      'object-cover'
    );
  });

  it('renders the fallback user icon when there is no profile image', async () => {
    (currentUser as jest.Mock).mockResolvedValue({
      imageUrl: undefined,
    });

    render(await UserIcon());

    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
  });

  it('renders the fallback user icon when there is no current user', async () => {
    (currentUser as jest.Mock).mockResolvedValue(null);

    render(await UserIcon());

    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
  });

  it('calls currentUser to retrieve the authenticated user', async () => {
    (currentUser as jest.Mock).mockResolvedValue(null);

    render(await UserIcon());

    expect(currentUser).toHaveBeenCalledTimes(1);
  });

  it('applies the expected classes to the fallback user icon', async () => {
    (currentUser as jest.Mock).mockResolvedValue(null);

    render(await UserIcon());

    expect(screen.getByTestId('user-icon')).toHaveClass(
      'w-6',
      'h-6',
      'bg-primary',
      'rounded-full',
      'text-white'
    );
  });
});