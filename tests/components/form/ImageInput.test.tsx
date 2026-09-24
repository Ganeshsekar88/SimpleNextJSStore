import { render, screen } from '@testing-library/react';
import ImageInput from '@/components/form/ImageInput';

describe('ImageInput', () => {
  it('renders the Image label', () => {
    render(<ImageInput />);

    expect(screen.getByLabelText('Image')).toBeInTheDocument();
  });

  it('renders a file input with the correct name and id', () => {
    render(<ImageInput />);

    const input = screen.getByLabelText('Image');

    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('id', 'image');
    expect(input).toHaveAttribute('name', 'image');
  });

  it('requires an image to be selected', () => {
    render(<ImageInput />);

    const input = screen.getByLabelText('Image');

    expect(input).toBeRequired();
  });

  it('only accepts image files', () => {
    render(<ImageInput />);

    const input = screen.getByLabelText('Image');

    expect(input).toHaveAttribute('accept', 'image/*');
  });
});