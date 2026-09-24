
import { render, screen } from '@testing-library/react';
import { useFormStatus } from 'react-dom';
import { IconButton } from '@/components/form/IconButton';

jest.mock('react-dom', () => ({
    ...jest.requireActual('react-dom'),
    useFormStatus: jest.fn(),
}));

jest.mock('react-icons/lu', () => ({
    LuPen: () => <span data-testid='edit-icon' />,
    LuTrash2: () => <span data-testid='delete-icon' />,
}));

jest.mock('@radix-ui/react-icons', () => ({
    ReloadIcon: () => <span data-testid='reload-icon' />,
}));

const mockedUseFormStatus = useFormStatus as jest.Mock;

describe('IconButton', () => {
    beforeEach(() => {
        mockedUseFormStatus.mockReturnValue({
            pending: false,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the edit icon when actionType is edit', () => {
        render(<IconButton actionType='edit' />);

        expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
        expect(screen.queryByTestId('delete-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('reload-icon')).not.toBeInTheDocument();
    });

    it('renders the delete icon when actionType is delete', () => {
        render(<IconButton actionType='delete' />);

        expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
        expect(screen.queryByTestId('edit-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('reload-icon')).not.toBeInTheDocument();
    });

    it('renders the reload icon when form is pending', () => {
        mockedUseFormStatus.mockReturnValue({
            pending: true,
        });

        render(<IconButton actionType='edit' />);

        expect(screen.getByTestId('reload-icon')).toBeInTheDocument();
        expect(screen.queryByTestId('edit-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('delete-icon')).not.toBeInTheDocument();
    });

    it('renders the reload icon instead of the delete icon when form is pending', () => {
        mockedUseFormStatus.mockReturnValue({
            pending: true,
        });

        render(<IconButton actionType='delete' />);

        expect(screen.getByTestId('reload-icon')).toBeInTheDocument();
        expect(screen.queryByTestId('delete-icon')).not.toBeInTheDocument();
    });

    it('renders a submit button', () => {
        render(<IconButton actionType='edit' />);

        expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('throws an error for an invalid action type', () => {
        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => { });

        try {
            expect(() => {
                render(<IconButton actionType={'invalid' as never} />);
            }).toThrow('Invalid action type: invalid');
        } finally {
            consoleErrorSpy.mockRestore();
        }
    });
});
