import { render, screen, fireEvent, act } from '@testing-library/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import NavSearch from '@/components/navbar/NavSearch';

const mockReplace = jest.fn();

let debounceTimer: ReturnType<typeof setTimeout> | undefined;
let latestCallback: ((value: string) => void) | undefined;

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('use-debounce', () => ({
  useDebouncedCallback: jest.fn(
    (callback: (value: string) => void) => {
      latestCallback = callback;

      return (value: string) => {
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }

        debounceTimer = setTimeout(() => {
          latestCallback?.(value);
        }, 300);
      };
    }
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: ({
    type,
    placeholder,
    className,
    onChange,
    value,
  }: {
    type: string;
    placeholder: string;
    className?: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    value: string;
  }) => (
    <input
      type={type}
      placeholder={placeholder}
      className={className}
      onChange={onChange}
      value={value}
    />
  ),
}));

describe('NavSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    debounceTimer = undefined;
    latestCallback = undefined;

    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });

    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams()
    );
  });

  afterEach(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders the search input', () => {
    render(<NavSearch />);

    expect(
      screen.getByPlaceholderText('search product...')
    ).toBeInTheDocument();
  });

  it('initializes the input with the search query parameter', () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams('search=laptop')
    );

    render(<NavSearch />);

    expect(screen.getByPlaceholderText('search product...')).toHaveValue(
      'laptop'
    );
  });

  it('initializes with an empty value when there is no search parameter', () => {
    render(<NavSearch />);

    expect(screen.getByPlaceholderText('search product...')).toHaveValue('');
  });

  it('updates the input value when the user types', () => {
    render(<NavSearch />);

    const input = screen.getByPlaceholderText('search product...');

    fireEvent.change(input, {
      target: { value: 'phone' },
    });

    expect(input).toHaveValue('phone');
  });

  it('does not update the URL before the 300ms debounce delay', () => {
    render(<NavSearch />);

    fireEvent.change(screen.getByPlaceholderText('search product...'), {
      target: { value: 'phone' },
    });

    act(() => {
      jest.advanceTimersByTime(299);
    });

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('updates the URL after the 300ms debounce delay', () => {
    render(<NavSearch />);

    fireEvent.change(screen.getByPlaceholderText('search product...'), {
      target: { value: 'phone' },
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith('/products?search=phone');
  });

  it('debounces consecutive searches and only uses the latest value', () => {
    render(<NavSearch />);

    const input = screen.getByPlaceholderText('search product...');

    fireEvent.change(input, {
      target: { value: 'p' },
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    fireEvent.change(input, {
      target: { value: 'ph' },
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    fireEvent.change(input, {
      target: { value: 'phone' },
    });

    expect(mockReplace).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith('/products?search=phone');
  });

  it('updates the existing search parameter', () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams('search=phone')
    );

    render(<NavSearch />);

    fireEvent.change(screen.getByPlaceholderText('search product...'), {
      target: { value: 'laptop' },
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockReplace).toHaveBeenCalledWith('/products?search=laptop');
  });

  it('removes the search parameter when the input is cleared', () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams('search=phone')
    );

    render(<NavSearch />);

    fireEvent.change(screen.getByPlaceholderText('search product...'), {
      target: { value: '' },
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockReplace).toHaveBeenCalledWith('/products?');
  });

  it('resets the input when the search parameter is removed', () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams('search=phone')
    );

    const { rerender } = render(<NavSearch />);

    const input = screen.getByPlaceholderText('search product...');

    expect(input).toHaveValue('phone');

    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams()
    );

    rerender(<NavSearch />);

    expect(input).toHaveValue('');
  });

  it('uses useDebouncedCallback with a 300ms delay', () => {
    render(<NavSearch />);

    expect(useDebouncedCallback).toHaveBeenCalledWith(
      expect.any(Function),
      300
    );
  });

  it('renders the expected input attributes and classes', () => {
    render(<NavSearch />);

    const input = screen.getByPlaceholderText('search product...');

    expect(input).toHaveAttribute('type', 'search');
    expect(input).toHaveAttribute(
      'placeholder',
      'search product...'
    );
    expect(input).toHaveClass('max-w-xs', 'dark:bg-muted');
  });
});