
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PriceInput from '@/components/form/PriceInput';

describe('PriceInput', () => {
  it('renders the price label', () => {
    render(<PriceInput />);

    expect(screen.getByText('Price ($)')).toBeInTheDocument();
  });

  it('renders a number input with the correct attributes', () => {
    render(<PriceInput />);

    const input = screen.getByRole('spinbutton');

    expect(input).toHaveAttribute('id', 'price');
    expect(input).toHaveAttribute('name', 'price');
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', '0.01');
    expect(input).toHaveAttribute('step', '0.01');
    expect(input).toBeRequired();
  });

  it('associates the label with the price input', () => {
    render(<PriceInput />);

    const input = screen.getByLabelText('Price ($)');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'price');
  });

  it('uses 100 as the default value when no defaultValue is provided', () => {
    render(<PriceInput />);

    const input = screen.getByRole('spinbutton');

    expect(input).toHaveValue(100);
  });

  it('uses the provided defaultValue', () => {
    render(<PriceInput defaultValue={250} />);

    const input = screen.getByRole('spinbutton');

    expect(input).toHaveValue(250);
  });

  it('accepts decimal prices', async () => {
    const user = userEvent.setup();

    render(<PriceInput />);

    const input = screen.getByLabelText('Price ($)');

    await user.clear(input);
    await user.type(input, '19.99');

    expect(input).toHaveValue(19.99);
    expect(input).toBeValid();
  });

  it('marks negative prices as invalid', async () => {
    const user = userEvent.setup();

    render(<PriceInput />);

    const input = screen.getByLabelText('Price ($)');

    await user.clear(input);
    await user.type(input, '-5');

    expect(input).toHaveValue(-5);
    expect(input).toBeInvalid();
  });

  it('marks zero prices as invalid', async () => {
    const user = userEvent.setup();

    render(<PriceInput />);

    const input = screen.getByLabelText('Price ($)');

    await user.clear(input);
    await user.type(input, '0');

    expect(input).toHaveValue(0);
    expect(input).toBeInvalid();
  });

  it('accepts the minimum valid price of 0.01', async () => {
    const user = userEvent.setup();

    render(<PriceInput />);

    const input = screen.getByLabelText('Price ($)');

    await user.clear(input);
    await user.type(input, '0.01');

    expect(input).toHaveValue(0.01);
    expect(input).toBeValid();
  });
});