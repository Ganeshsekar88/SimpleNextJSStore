
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageInputContainer from '@/components/form/ImageInputContainer';

const mockAction = jest.fn();

jest.mock('@/components/form/FormContainer', () => {
  return function MockFormContainer({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <form data-testid="image-update-form">{children}</form>;
  };
});

jest.mock('@/components/form/ImageInput', () => {
  return function MockImageInput() {
    return <input aria-label="Image" type="file" />;
  };
});

jest.mock('@/components/form/Buttons', () => ({
  SubmitButton: ({ size }: { size?: string }) => (
    <button type="submit" data-testid="submit-button" data-size={size}>
      Submit
    </button>
  ),
}));

describe('ImageInputContainer', () => {
  const defaultProps = {
    image: '/test-image.jpg',
    name: 'Product Image',
    action: mockAction,
    text: 'Update Image',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the image with the correct src and alt text', () => {
    render(<ImageInputContainer {...defaultProps} />);

    const image = screen.getByRole('img', {
      name: 'Product Image',
    });

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', 'Product Image');
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  it('renders the update button with the provided text', () => {
    render(<ImageInputContainer {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: 'Update Image' })
    ).toBeInTheDocument();
  });

  it('does not render the update form initially', () => {
    render(<ImageInputContainer {...defaultProps} />);

    expect(
      screen.queryByTestId('image-update-form')
    ).not.toBeInTheDocument();

    expect(
      screen.queryByLabelText('Image')
    ).not.toBeInTheDocument();

    expect(
      screen.queryByTestId('submit-button')
    ).not.toBeInTheDocument();
  });

  it('renders the update form when the update button is clicked', async () => {
    const user = userEvent.setup();

    render(<ImageInputContainer {...defaultProps} />);

    await user.click(
      screen.getByRole('button', { name: 'Update Image' })
    );

    expect(
      screen.getByTestId('image-update-form')
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText('Image')
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('submit-button')
    ).toBeInTheDocument();
  });

  it('hides the update form when the update button is clicked again', async () => {
    const user = userEvent.setup();

    render(<ImageInputContainer {...defaultProps} />);

    const updateButton = screen.getByRole('button', {
      name: 'Update Image',
    });

    await user.click(updateButton);

    expect(
      screen.getByTestId('image-update-form')
    ).toBeInTheDocument();

    await user.click(updateButton);

    expect(
      screen.queryByTestId('image-update-form')
    ).not.toBeInTheDocument();

    expect(
      screen.queryByLabelText('Image')
    ).not.toBeInTheDocument();

    expect(
      screen.queryByTestId('submit-button')
    ).not.toBeInTheDocument();
  });

  it('renders children inside the update form', async () => {
    const user = userEvent.setup();

    render(
      <ImageInputContainer {...defaultProps}>
        <input aria-label="Custom input" />
      </ImageInputContainer>
    );

    await user.click(
      screen.getByRole('button', { name: 'Update Image' })
    );

    expect(
      screen.getByTestId('image-update-form')
    ).toContainElement(
      screen.getByLabelText('Custom input')
    );
  });

  it('renders the SubmitButton with the sm size', async () => {
    const user = userEvent.setup();

    render(<ImageInputContainer {...defaultProps} />);

    await user.click(
      screen.getByRole('button', { name: 'Update Image' })
    );

    expect(
      screen.getByTestId('submit-button')
    ).toHaveAttribute('data-size', 'sm');
  });

  it('renders the ImageInput inside the update form', async () => {
    const user = userEvent.setup();

    render(<ImageInputContainer {...defaultProps} />);

    await user.click(
      screen.getByRole('button', { name: 'Update Image' })
    );

    expect(
      screen.getByLabelText('Image')
    ).toHaveAttribute('type', 'file');
  });

  it('toggles the update form each time the button is clicked', async () => {
    const user = userEvent.setup();

    render(<ImageInputContainer {...defaultProps} />);

    const updateButton = screen.getByRole('button', {
      name: 'Update Image',
    });

    // Initially hidden
    expect(
      screen.queryByTestId('image-update-form')
    ).not.toBeInTheDocument();

    // First click -> visible
    await user.click(updateButton);

    expect(
      screen.getByTestId('image-update-form')
    ).toBeInTheDocument();

    // Second click -> hidden
    await user.click(updateButton);

    expect(
      screen.queryByTestId('image-update-form')
    ).not.toBeInTheDocument();

    // Third click -> visible again
    await user.click(updateButton);

    expect(
      screen.getByTestId('image-update-form')
    ).toBeInTheDocument();
  });
});
