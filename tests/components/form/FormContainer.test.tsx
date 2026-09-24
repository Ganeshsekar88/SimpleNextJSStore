
import { render, screen } from '@testing-library/react';
import { useFormState } from 'react-dom';
import { useToast } from '@/components/ui/use-toast';
import FormContainer from '@/components/form/FormContainer';

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormState: jest.fn(),
}));

jest.mock('@/components/ui/use-toast', () => ({
  useToast: jest.fn(),
}));

const mockAction = jest.fn();
const mockFormAction = '/mock-form-action';
const mockToast = jest.fn();

describe('FormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });
  });

  it('renders its children inside a form', () => {
    (useFormState as jest.Mock).mockReturnValue([
      { message: '' },
      mockFormAction,
    ]);

    render(
      <FormContainer action={mockAction}>
        <input name='email' />
        <button type='submit'>Submit</button>
      </FormContainer>
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Submit' })
    ).toBeInTheDocument();

    expect(document.querySelector('form')).toBeInTheDocument();
  });

  it('passes the action to useFormState with the initial state', () => {
    (useFormState as jest.Mock).mockReturnValue([
      { message: '' },
      mockFormAction,
    ]);

    render(
      <FormContainer action={mockAction}>
        <button>Submit</button>
      </FormContainer>
    );

    expect(useFormState).toHaveBeenCalledWith(
      mockAction,
      { message: '' }
    );
  });

  it('shows a toast when state contains a message', () => {
    (useFormState as jest.Mock).mockReturnValue([
      { message: 'Product added successfully' },
      mockFormAction,
    ]);

    render(
      <FormContainer action={mockAction}>
        <button>Submit</button>
      </FormContainer>
    );

    expect(mockToast).toHaveBeenCalledWith({
      description: 'Product added successfully',
    });
  });

  it('does not show a toast when state has no message', () => {
    (useFormState as jest.Mock).mockReturnValue([
      { message: '' },
      mockFormAction,
    ]);

    render(
      <FormContainer action={mockAction}>
        <button>Submit</button>
      </FormContainer>
    );

    expect(mockToast).not.toHaveBeenCalled();
  });
});
