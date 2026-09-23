// import userEvent from '@testing-library/user-event';
// import { render, screen } from '@testing-library/react';
// import SubmitReview from '@/components/reviews/SubmitReview';

// jest.mock('@clerk/nextjs', () => ({ useUser: () => ({ user: { firstName: 'Ava', imageUrl: 'https://example.com/ava.png' } }) }));
// jest.mock('@/utils/actions', () => ({ createReviewAction: jest.fn() }));
// jest.mock('@/components/form/Buttons', () => ({
//   SubmitButton: () => <button type='submit'>submit</button>,
// }));
// jest.mock('@/components/form/FormContainer', () => ({
//   __esModule: true,
//   default: ({ children }: { children: React.ReactNode }) => <form>{children}</form>,
// }));

// describe('SubmitReview', () => {
//   it('reveals a review form only after the customer asks to leave a review', async () => {
//     const user = userEvent.setup();
//     render(<SubmitReview productId='product-1' />);

//     expect(screen.queryByLabelText(/feedback/i)).not.toBeInTheDocument();
//     await user.click(screen.getByRole('button', { name: /leave review/i }));

//     expect(screen.getByLabelText(/feedback/i)).toHaveValue('Outstanding product!!!');
//     expect(screen.getByDisplayValue('product-1')).toHaveAttribute('name', 'productId');
//     expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
//   });
// });

import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import SubmitReview from '@/components/reviews/SubmitReview';

jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: {
      firstName: 'Ava',
      imageUrl: 'https://example.com/ava.png',
    },
  }),
}));

jest.mock('@/utils/actions', () => ({
  createReviewAction: jest.fn(),
}));

jest.mock('@/components/form/Buttons', () => ({
  SubmitButton: () => <button type="submit">submit</button>,
}));

jest.mock('@/components/form/FormContainer', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <form>{children}</form>
  ),
}));

describe('SubmitReview', () => {
  it('does not show the review form initially', () => {
    render(<SubmitReview productId="product-1" />);

    expect(
      screen.getByRole('button', { name: /leave review/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByLabelText(/feedback/i)
    ).not.toBeInTheDocument();
  });

  it('reveals the review form when the customer clicks leave review', async () => {
    const user = userEvent.setup();

    render(<SubmitReview productId="product-1" />);

    await user.click(
      screen.getByRole('button', { name: /leave review/i })
    );

    expect(
      screen.getByLabelText(/feedback/i)
    ).toHaveValue('Outstanding product!!!');

    expect(
      screen.getByDisplayValue('product-1')
    ).toHaveAttribute('name', 'productId');

    expect(
      screen.getByDisplayValue('Ava')
    ).toHaveAttribute('name', 'authorName');

    expect(
      screen.getByDisplayValue('https://example.com/ava.png')
    ).toHaveAttribute('name', 'authorImageUrl');

    expect(
      screen.getByRole('button', { name: /submit/i })
    ).toBeInTheDocument();
  });

  it('renders the default rating as 5', async () => {
    const user = userEvent.setup();

    render(<SubmitReview productId="product-1" />);

    await user.click(
      screen.getByRole('button', { name: /leave review/i })
    );

    const rating = screen.getByRole('combobox');

    expect(rating).toBeInTheDocument();
    expect(rating).toHaveTextContent('5');
  });

  it('allows the customer to change the rating', async () => {
    const user = userEvent.setup();

    render(<SubmitReview productId="product-1" />);

    await user.click(
      screen.getByRole('button', { name: /leave review/i })
    );

    const rating = screen.getByRole('combobox');

    expect(rating).toHaveTextContent('5');

    await user.click(rating);

    const option = await screen.findByRole('option', { name: '3' });

    await user.click(option);

    expect(rating).toHaveTextContent('3');
  });

  it('allows the customer to edit the feedback', async () => {
    const user = userEvent.setup();

    render(<SubmitReview productId="product-1" />);

    await user.click(
      screen.getByRole('button', { name: /leave review/i })
    );

    const feedback = screen.getByLabelText(/feedback/i);

    expect(feedback).toHaveValue('Outstanding product!!!');

    await user.clear(feedback);
    await user.type(feedback, 'Great product!');

    expect(feedback).toHaveValue('Great product!');
  });

  it('hides the review form when leave review is clicked again', async () => {
    const user = userEvent.setup();

    render(<SubmitReview productId="product-1" />);

    const leaveReviewButton = screen.getByRole('button', {
      name: /leave review/i,
    });

    await user.click(leaveReviewButton);

    expect(
      screen.getByLabelText(/feedback/i)
    ).toBeInTheDocument();

    await user.click(leaveReviewButton);

    expect(
      screen.queryByLabelText(/feedback/i)
    ).not.toBeInTheDocument();
  });
});
