// tests/components/form/Buttons.test.tsx

import { render, screen } from '@testing-library/react';
import { useFormStatus } from 'react-dom';
import { SubmitButton, CardSubmitButton, ProductSignInButton, CardSignInButton } from '@/components/form/Buttons';


jest.mock('react-dom', () => ({
    ...jest.requireActual('react-dom'),
    useFormStatus: jest.fn(),
}));


jest.mock('react-icons/fa', () => ({
    FaHeart: () => <span data-testid="favorite-icon" />,
    FaRegHeart: () => <span data-testid="not-favorite-icon" />,
}));

//wrong mock for Clerk SignInButton, it should be a div instead of button to avoid nested button issue

// jest.mock('@clerk/nextjs', () => ({
//     SignInButton: ({ children }: { children: React.ReactNode }) => (
//         <button data-testid="sign-in-button">
//             {children}
//         </button>
//     ),
// }));

jest.mock('@clerk/nextjs', () => ({
    SignInButton: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="sign-in-button">
            {children}
        </div>
    ),
}));

jest.mock('@radix-ui/react-icons', () => ({
    ReloadIcon: () => (
        <span data-testid="reload-icon" />
    ),
}));


const mockUseFormStatus = useFormStatus as jest.Mock;

describe('SubmitButton', () => {
    it('renders the provided text when not pending', () => {
        mockUseFormStatus.mockReturnValue({ pending: false });

        render(<SubmitButton text="Add to Cart" />);

        expect(
            screen.getByRole('button', { name: 'Add to Cart' })
        ).toBeInTheDocument();
    });

    it('renders default text when no text is provided', () => {
        mockUseFormStatus.mockReturnValue({ pending: false });

        render(<SubmitButton />);

        expect(
            screen.getByRole('button', { name: 'submit' })
        ).toBeInTheDocument();
    });

    it('shows loading state while pending', () => {
        mockUseFormStatus.mockReturnValue({ pending: true });

        render(<SubmitButton />);

        expect(
            screen.getByRole('button', { name: /please wait/i })
        ).toBeDisabled();
    });

    it('is enabled when not pending', () => {
        mockUseFormStatus.mockReturnValue({ pending: false });

        render(<SubmitButton text="Save" />);

        expect(
            screen.getByRole('button', { name: 'Save' })
        ).not.toBeDisabled();
    });
});

describe('CardSubmitButton', () => {
    it('shows the filled heart when the product is a favorite', () => {
        mockUseFormStatus.mockReturnValue({ pending: false });

        render(<CardSubmitButton isFavorite={true} />);

        expect(screen.getByTestId('favorite-icon')).toBeInTheDocument();
        expect(
            screen.queryByTestId('not-favorite-icon')
        ).not.toBeInTheDocument();
    });

    it('shows the outline heart when the product is not a favorite', () => {
        mockUseFormStatus.mockReturnValue({ pending: false });

        render(<CardSubmitButton isFavorite={false} />);

        expect(
            screen.getByTestId('not-favorite-icon')
        ).toBeInTheDocument();
    });

    it('shows loading state when pending', () => {
        mockUseFormStatus.mockReturnValue({ pending: true });

        render(<CardSubmitButton isFavorite={true} />);

        expect(
            screen.getByTestId('reload-icon')
        ).toBeInTheDocument();

        expect(
            screen.queryByTestId('favorite-icon')
        ).not.toBeInTheDocument();

        expect(
            screen.queryByTestId('not-favorite-icon')
        ).not.toBeInTheDocument();
    });
});

describe('ProductSignInButton', () => {
    it('renders the sign-in button', () => {
        render(<ProductSignInButton />);

        expect(
            screen.getByRole('button', { name: /please sign in/i })
        ).toBeInTheDocument();
    });
});

describe('CardSignInButton', () => {
    it('renders the favorite icon inside the Clerk sign-in trigger', () => {
        render(<CardSignInButton />);

        expect(
            screen.getByTestId('sign-in-button')
        ).toBeInTheDocument();

        expect(
            screen.getByTestId('not-favorite-icon')
        ).toBeInTheDocument();
    });
});

