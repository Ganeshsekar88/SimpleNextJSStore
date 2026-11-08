import { IconButton } from '@/components/form/IconButton';
import FormContainer from '@/components/form/FormContainer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PaginationControls from '@/components/admin/PaginationControls';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteProductAction, fetchAdminProductsPage } from '@/utils/actions';
import { ADMIN_PAGE_SIZE } from '@/utils/admin-pagination';
import { formatCurrency } from '@/utils/format';
import Link from 'next/link';
import { LuPlus } from 'react-icons/lu';
import { redirect } from 'next/navigation';

async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const { page } = await searchParams;
  const pageValue = Array.isArray(page) ? page[0] : page;
  const requestedPage = Number.parseInt(pageValue ?? '1', 10);
  const data = await fetchAdminProductsPage(requestedPage);
  const { items, totalItems, currentPage, totalPages } = data;
  if (requestedPage !== currentPage) {
    redirect(currentPage === 1 ? '/admin/products' : `/admin/products?page=${currentPage}`);
  }

  return (
    <section className='space-y-8'>
      <header className='flex flex-col gap-6 rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-8'>
        <div className='space-y-2'>
          <p className='text-sm font-semibold uppercase tracking-[0.18em] text-primary'>
            Catalog management
          </p>
          <h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>
            My Products
          </h1>
          <p className='max-w-xl text-sm text-muted-foreground sm:text-base'>
            Manage your store listings, prices, and product details.
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <span className='rounded-xl border bg-background/80 px-4 py-3 text-sm text-muted-foreground shadow-sm'>
            <span className='font-semibold tabular-nums text-foreground'>
              {totalItems}
            </span>{' '}
            {totalItems === 1 ? 'product' : 'products'}
          </span>
          <Button asChild className='gap-2 shadow-sm'>
            <Link href='/admin/products/create'>
              <LuPlus aria-hidden='true' />
              Add product
            </Link>
          </Button>
        </div>
      </header>

      <Card className='overflow-hidden rounded-2xl shadow-sm'>
        <div className='flex flex-col gap-1 border-b bg-muted/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
          <div>
            <h2 className='font-semibold tracking-tight'>Product catalog</h2>
            <p className='text-sm text-muted-foreground'>Your active product listings</p>
          </div>
          <span className='text-sm tabular-nums text-muted-foreground'>
            {totalItems} {totalItems === 1 ? 'listing' : 'listings'}
          </span>
        </div>

        <Table className='min-w-[640px]'>
          <TableCaption className='sr-only'>
            Your product listings with company, price, and management actions.
          </TableCaption>
          <TableHeader>
            <TableRow className='border-b bg-muted/50 hover:bg-muted/50'>
              <TableHead className='h-12 px-5 text-xs font-semibold uppercase tracking-wider'>
                Product Name
              </TableHead>
              <TableHead className='h-12 text-xs font-semibold uppercase tracking-wider'>
                Company
              </TableHead>
              <TableHead className='h-12 text-right text-xs font-semibold uppercase tracking-wider'>
                Price
              </TableHead>
              <TableHead className='h-12 px-5 text-right text-xs font-semibold uppercase tracking-wider'>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow className='hover:bg-transparent'>
                <TableCell
                  colSpan={4}
                  className='h-32 text-center text-muted-foreground'
                >
                  No products yet. Add your first product to start your catalog.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const { id: productId, name, company, price } = item;
                return (
                  <TableRow
                    key={productId}
                    className='transition-colors even:bg-muted/20 hover:bg-primary/5 dark:even:bg-muted/10 dark:hover:bg-primary/10'
                  >
                    <TableCell className='px-5 py-4'>
                      <Link
                        href={`/products/${productId}`}
                        className='font-medium capitalize text-foreground underline-offset-4 hover:text-primary hover:underline'
                      >
                        {name}
                      </Link>
                    </TableCell>
                    <TableCell className='capitalize text-muted-foreground'>
                      {company}
                    </TableCell>
                    <TableCell className='text-right font-semibold tabular-nums'>
                      {formatCurrency(price)}
                    </TableCell>
                    <TableCell className='px-5'>
                      <div className='flex items-center justify-end gap-1'>
                        <Link href={`/admin/products/${productId}/edit`}>
                          <IconButton actionType='edit' />
                        </Link>
                        <DeleteProduct productId={productId} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={ADMIN_PAGE_SIZE}
          href='/admin/products'
          itemLabel='products'
        />
      </Card>
    </section>
  );
}

function DeleteProduct({ productId }: { productId: string }) {
  const deleteProduct = deleteProductAction.bind(null, { productId });
  return (
    <FormContainer action={deleteProduct}>
      <IconButton actionType='delete' />
    </FormContainer>
  );
}

export default ItemsPage;
