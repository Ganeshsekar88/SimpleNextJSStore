import { render, screen } from '@testing-library/react';
import FormInput from '@/components/form/FormInput';

describe('FormInput', () => {
  it('renders the input and label', () => {
    render(
      <FormInput
        name="username"
        type="text"
        label="Username"
      />
    );

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('associates the label with the input', () => {
    render(
      <FormInput
        name="username"
        type="text"
        label="Username"
      />
    );

    const input = screen.getByLabelText('Username');

    expect(input).toHaveAttribute('id', 'username');
    expect(input).toHaveAttribute('name', 'username');
  });

  it('sets the input type and required attribute', () => {
    render(
      <FormInput
        name="email"
        type="email"
        label="Email"
      />
    );

    const input = screen.getByLabelText('Email');

    expect(input).toHaveAttribute('type', 'email');
    expect(input).toBeRequired();
  });

  it('renders the provided placeholder', () => {
    render(
      <FormInput
        name="username"
        type="text"
        placeholder="Enter your username"
      />
    );

    expect(
      screen.getByPlaceholderText('Enter your username')
    ).toBeInTheDocument();
  });

  it('renders the default value', () => {
    render(
      <FormInput
        name="username"
        type="text"
        defaultValue="Ganesh"
      />
    );

    expect(screen.getByDisplayValue('Ganesh')).toBeInTheDocument();
  });

  it('uses the label prop as the label text', () => {
    render(
      <FormInput
        name="username"
        type="text"
        label="Your Name"
      />
    );

    expect(screen.getByLabelText('Your Name')).toBeInTheDocument();
  });

  it('falls back to the name when label is not provided', () => {
    render(
      <FormInput
        name="username"
        type="text"
      />
    );

    expect(screen.getByLabelText('username')).toBeInTheDocument();
  });
});