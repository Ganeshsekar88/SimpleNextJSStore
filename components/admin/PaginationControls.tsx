import { Button } from '@/components/ui/button';
import Link from 'next/link';

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  href: string;
  itemLabel: string;
};

function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  href,
  itemLabel,
}: PaginationControlsProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className='flex flex-col gap-3 border-t bg-muted/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
      <p className='text-sm text-muted-foreground' aria-live='polite'>
        Showing <span className='font-medium text-foreground'>{startItem}–{endItem}</span> of{' '}
        <span className='font-medium text-foreground'>{totalItems}</span> {itemLabel}
      </p>

      {totalPages > 1 && (
        <nav
          aria-label={`${itemLabel} pagination`}
          className='flex items-center gap-2'
        >
          {currentPage > 1 ? (
            <Button asChild variant='outline' size='sm'>
              <Link href={`${href}?page=${currentPage - 1}`} rel='prev'>
                Previous
              </Link>
            </Button>
          ) : (
            <Button variant='outline' size='sm' disabled>
              Previous
            </Button>
          )}
          <span className='min-w-24 text-center text-sm tabular-nums text-muted-foreground'>
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages ? (
            <Button asChild variant='outline' size='sm'>
              <Link href={`${href}?page=${currentPage + 1}`} rel='next'>
                Next
              </Link>
            </Button>
          ) : (
            <Button variant='outline' size='sm' disabled>
              Next
            </Button>
          )}
        </nav>
      )}
    </div>
  );
}

export default PaginationControls;
