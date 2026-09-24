import { render, screen } from '@testing-library/react';
import SectionTitle from '@/components/global/SectionTitle';

describe('SectionTitle', () => {
    it('renders the provided title text', () => {
        render(<SectionTitle text="Featured Products" />);

        expect(
            screen.getByRole('heading', { name: 'Featured Products' })
        ).toBeInTheDocument();
    });

    it('renders the heading with the expected classes', () => {
        render(<SectionTitle text="Featured Products" />);

        const heading = screen.getByRole('heading', {
            name: 'Featured Products',
        });

        expect(heading).toHaveClass(
            'text-3xl',
            'font-medium',
            'tracking-wider',
            'capitalize',
            'mb-8'
        );
    });

    it('renders a horizontal separator below the heading', () => {
        const { container } = render(
            <SectionTitle text="Featured Products" />
        );

        const separator = container.querySelector(
            '[data-orientation="horizontal"]'
        );

        expect(separator).toBeInTheDocument();
    });

    it('renders the separator with the expected default classes', () => {
        const { container } = render(
            <SectionTitle text="Featured Products" />
        );

        const separator = container.querySelector(
          '[data-orientation="horizontal"]'
        );

        //dom does not produce role attribute of separator
        // const separator = screen.getByRole('separator');

        expect(separator).toBeInTheDocument();

        expect(separator).toHaveClass(
            'shrink-0',
            'bg-border',
            'h-[1px]',
            'w-full'
        );
    });
});