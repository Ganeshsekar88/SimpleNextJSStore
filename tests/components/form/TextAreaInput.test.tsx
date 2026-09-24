
import { render, screen } from '@testing-library/react';
import TextAreaInput from '@/components/form/TextAreaInput';

describe('TextAreaInput', () => {
  it('renders the textarea with the correct attributes', () => {
    render(<TextAreaInput name='description' />);

    const textarea = screen.getByRole('textbox');

    expect(textarea).toHaveAttribute('id', 'description');
    expect(textarea).toHaveAttribute('name', 'description');
    expect(textarea).toHaveAttribute('rows', '5');
    expect(textarea).toBeRequired();
  });

  it('associates the label with the textarea', () => {
    render(<TextAreaInput name='description' />);

    const textarea = screen.getByLabelText('description');

    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('id', 'description');
  });

  it('uses the name as the label when labelText is not provided', () => {
    render(<TextAreaInput name='description' />);

    expect(screen.getByText('description')).toBeInTheDocument();
  });

  it('renders the provided labelText', () => {
    render(
      <TextAreaInput
        name='description'
        labelText='Product Description'
      />
    );

    expect(screen.getByText('Product Description')).toBeInTheDocument();
  });

  it('uses the provided defaultValue', () => {
    render(
      <TextAreaInput
        name='description'
        defaultValue='This is the product description'
      />
    );

    const textarea = screen.getByRole('textbox');

    expect(textarea).toHaveValue('This is the product description');
  });
});
