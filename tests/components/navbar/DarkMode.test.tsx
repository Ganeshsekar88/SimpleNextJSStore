import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTheme } from 'next-themes';

import ModeToggle from '@/components/navbar/DarkMode';

const mockSetTheme = jest.fn();

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    variant,
    size,
    ...props
  }: {
    children: React.ReactNode;
    variant?: string;
    size?: string;
  }) => (
    <button
      {...props}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div>{children}</div>,

  DropdownMenuTrigger: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div>{children}</div>,

  DropdownMenuContent: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div role='menu'>{children}</div>,

  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <div
      role='menuitem'
      tabIndex={0}
      onClick={onClick}
    >
      {children}
    </div>
  ),
}));

jest.mock('@radix-ui/react-icons', () => ({
  SunIcon: ({
    className,
  }: {
    className?: string;
  }) => (
    <svg
      data-testid='sun-icon'
      className={className}
    />
  ),

  MoonIcon: ({
    className,
  }: {
    className?: string;
  }) => (
    <svg
      data-testid='moon-icon'
      className={className}
    />
  ),
}));

describe('ModeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    document.documentElement.classList.remove('dark');

    (useTheme as jest.Mock).mockReturnValue({
      setTheme: mockSetTheme,
      theme: 'light',
    });
  });

  afterEach(() => {
    document.documentElement.classList.remove('dark');
  });

  it('renders the theme toggle button with the accessible label', () => {
    render(<ModeToggle />);

    expect(
      screen.getByRole('button', {
        name: 'Toggle theme',
      }),
    ).toBeInTheDocument();
  });

  it('renders the toggle button with outline variant and icon size', () => {
    render(<ModeToggle />);

    const button = screen.getByRole('button', {
      name: 'Toggle theme',
    });

    expect(button).toHaveAttribute(
      'data-variant',
      'outline',
    );

    expect(button).toHaveAttribute(
      'data-size',
      'icon',
    );
  });

  it('renders only the sun icon for the light theme', () => {
    (useTheme as jest.Mock).mockReturnValue({
      setTheme: mockSetTheme,
      theme: 'light',
    });

    document.documentElement.classList.remove('dark');

    render(<ModeToggle />);

    const sunIcon = screen.getByTestId('sun-icon');
    const moonIcon = screen.getByTestId('moon-icon');

    /*
     * In light mode, the sun icon has the visible state:
     * rotate-0 + scale-100
     *
     * The moon icon has the hidden state:
     * rotate-90 + scale-0
     */
    expect(sunIcon).toHaveClass(
      'rotate-0',
      'scale-100',
    );

    expect(moonIcon).toHaveClass(
      'rotate-90',
      'scale-0',
    );
  });

  it('renders only the moon icon for the dark theme', () => {
    (useTheme as jest.Mock).mockReturnValue({
      setTheme: mockSetTheme,
      theme: 'dark',
    });

    document.documentElement.classList.add('dark');

    render(<ModeToggle />);

    const sunIcon = screen.getByTestId('sun-icon');
    const moonIcon = screen.getByTestId('moon-icon');

    /*
     * In dark mode, Tailwind's dark variants apply:
     *
     * Sun:
     * dark:-rotate-90 + dark:scale-0
     *
     * Moon:
     * dark:rotate-0 + dark:scale-100
     */
    expect(sunIcon).toHaveClass(
      'dark:-rotate-90',
      'dark:scale-0',
    );

    expect(moonIcon).toHaveClass(
      'dark:rotate-0',
      'dark:scale-100',
    );
  });

  it('uses the correct base classes for the sun icon', () => {
    render(<ModeToggle />);

    const sunIcon = screen.getByTestId('sun-icon');

    expect(sunIcon).toHaveClass(
      'h-[1.2rem]',
      'w-[1.2rem]',
      'rotate-0',
      'scale-100',
      'transition-all',
    );

    expect(sunIcon).toHaveClass(
      'dark:-rotate-90',
      'dark:scale-0',
    );
  });

  it('uses the correct base classes for the moon icon', () => {
    render(<ModeToggle />);

    const moonIcon = screen.getByTestId('moon-icon');

    expect(moonIcon).toHaveClass(
      'absolute',
      'h-[1.2rem]',
      'w-[1.2rem]',
      'rotate-90',
      'scale-0',
      'transition-all',
    );

    expect(moonIcon).toHaveClass(
      'dark:rotate-0',
      'dark:scale-100',
    );
  });

  it('renders the three theme options as menu items', () => {
    render(<ModeToggle />);

    const menuItems = screen.getAllByRole('menuitem');

    expect(menuItems).toHaveLength(3);

    expect(menuItems[0]).toHaveTextContent('Light');
    expect(menuItems[1]).toHaveTextContent('Dark');
    expect(menuItems[2]).toHaveTextContent('System');
  });

  it('sets the light theme when the first menu item is selected', async () => {
    const user = userEvent.setup();

    render(<ModeToggle />);

    const menuItems = screen.getAllByRole('menuitem');

    await user.click(menuItems[0]);

    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('sets the dark theme when the second menu item is selected', async () => {
    const user = userEvent.setup();

    render(<ModeToggle />);

    const menuItems = screen.getAllByRole('menuitem');

    await user.click(menuItems[1]);

    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('sets the system theme when the third menu item is selected', async () => {
    const user = userEvent.setup();

    render(<ModeToggle />);

    const menuItems = screen.getAllByRole('menuitem');

    await user.click(menuItems[2]);

    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });
});