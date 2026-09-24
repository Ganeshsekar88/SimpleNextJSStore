
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Comment from '@/components/reviews/Comment';

describe('Comment', () => {
  describe('short comments', () => {
    it('renders the complete comment', () => {
      const comment = 'This is a short comment.';

      render(<Comment comment={comment} />);

      expect(screen.getByText(comment)).toBeInTheDocument();
    });

    it('does not render the Show More button', () => {
      const comment = 'This is a short comment.';

      render(<Comment comment={comment} />);

      expect(
        screen.queryByRole('button', { name: 'Show More' })
      ).not.toBeInTheDocument();
    });
  });

  describe('long comments', () => {
    const comment =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'.repeat(5);

    it('renders only the first 130 characters followed by an ellipsis initially along with show more button', () => {
      render(<Comment comment={comment} />);

      const expectedComment = `${comment.slice(0, 130)}...`;

      expect(screen.getByText(expectedComment)).toBeInTheDocument();
      expect(screen.queryByText(comment)).not.toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Show More' })
      ).toBeInTheDocument();

    });

    // it('renders the Show More button for a long comment', () => {
    //   render(<Comment comment={comment} />);

    //   expect(
    //     screen.getByRole('button', { name: 'Show More' })
    //   ).toBeInTheDocument();
    // });

    it('expands the comment when Show More is clicked', async () => {
      const user = userEvent.setup();

      const comment =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'.repeat(5);

      render(<Comment comment={comment} />);

      const showMoreButton = screen.getByRole('button', {
        name: 'Show More',
      });

      await user.click(showMoreButton);

      expect(screen.getByText(comment)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Show Less' })
      ).toBeInTheDocument();
    });

    it('collapses the comment when Show Less is clicked', async () => {
      const user = userEvent.setup();

      const comment =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'.repeat(5);

      render(<Comment comment={comment} />);

      await user.click(
        screen.getByRole('button', { name: 'Show More' })
      );

      await user.click(
        screen.getByRole('button', { name: 'Show Less' })
      );

      const expectedComment = `${comment.slice(0, 130)}...`;

      expect(screen.getByText(expectedComment)).toBeInTheDocument();
      expect(screen.queryByText(comment)).not.toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Show More' })
      ).toBeInTheDocument();
    });
  });

  describe('boundary conditions', () => {
    it('renders a 130-character comment completely without Show More', () => {
      const comment = 'a'.repeat(130);

      render(<Comment comment={comment} />);

      expect(screen.getByText(comment)).toBeInTheDocument();

      expect(
        screen.queryByRole('button', { name: 'Show More' })
      ).not.toBeInTheDocument();
    });

    it('truncates a 131-character comment', () => {
      const comment = 'a'.repeat(131);

      render(<Comment comment={comment} />);

      expect(
        screen.getByText(`${comment.slice(0, 130)}...`)
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Show More' })
      ).toBeInTheDocument();
    });
  });
});
