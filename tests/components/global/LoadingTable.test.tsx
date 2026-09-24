import { render } from '@testing-library/react';
import LoadingTable from '@/components/global/LoadingTable';

describe('LoadingTable', () => {
    it('renders 5 skeleton rows by default', () => {
        const { container } = render(<LoadingTable />);

        const skeletons = container.querySelectorAll('.animate-pulse');

        expect(skeletons).toHaveLength(5);
    });

    it('renders the specified number of skeleton rows', () => {
        const { container } = render(<LoadingTable rows={8} />);

        const skeletons = container.querySelectorAll('.animate-pulse');

        expect(skeletons).toHaveLength(8);
    });

    it('applies the correct classes to every loading row', () => {
        const { container } = render(<LoadingTable />);

        const rows = container.querySelectorAll('.mb-4');

        expect(rows).toHaveLength(5);

        rows.forEach((row) => {
            expect(row).toHaveClass('mb-4');

            const skeleton = row.querySelector('.animate-pulse');

            expect(skeleton).toHaveClass(
                'w-full',
                'h-8',
                'rounded'
            );
        });
    });
});