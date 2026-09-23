import { render, screen } from '@testing-library/react';
import  CheckboxInput  from '@/components/form/CheckBoxInput';


describe('CheckboxInput', () => {
  it('renders checkbox and label', () => {
    render(
      <CheckboxInput
        name="featured"
        label="Featured"
      />
    );

    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByText('Featured');

    expect(checkbox).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  it('associates the label with the checkbox', () => {
    render(
      <CheckboxInput
        name="featured"
        label="Featured"
      />
    );

    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByText('Featured');

    expect(checkbox).toHaveAttribute('id', 'featured');
    expect(label).toHaveAttribute('for', 'featured');
  });

  it('passes defaultChecked to the checkbox', () => {
    render(
      <CheckboxInput
        name="featured"
        label="Featured"
        defaultChecked
      />
    );

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('is unchecked by default', () => {
    render(
      <CheckboxInput
        name="featured"
        label="Featured"
      />
    );

    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });
});