import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { fetchAdminOrders } from '@/utils/actions';
import { formatCurrency, formatDate } from '@/utils/format';

async function SalesPage() {
  const orders = await fetchAdminOrders();

  return (
    <section className='space-y-8'>
      <header className='flex flex-col gap-6 rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-8'>
        <div className='space-y-2'>
          <p className='text-sm font-semibold uppercase tracking-[0.18em] text-primary'>
            Store performance
          </p>
          <h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>
            Sales Overview
          </h1>
          <p className='max-w-xl text-sm text-muted-foreground sm:text-base'>
            Review customer orders and their payment breakdowns.
          </p>
        </div>
        <div className='flex w-fit items-center gap-3 rounded-xl border bg-background/80 px-4 py-3 shadow-sm'>
          <span className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg font-semibold text-primary'>
            {orders.length}
          </span>
          <span className='text-sm font-medium text-muted-foreground'>
            {orders.length === 1 ? 'order recorded' : 'orders recorded'}
          </span>
        </div>
      </header>

      <Card className='overflow-hidden rounded-2xl shadow-sm'>
        <div className='flex flex-col gap-1 border-b bg-muted/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
          <div>
            <h2 className='font-semibold tracking-tight'>Recent sales</h2>
            <p className='text-sm text-muted-foreground'>Order totals and fulfillment costs</p>
          </div>
          <span className='text-sm tabular-nums text-muted-foreground'>
            {orders.length} {orders.length === 1 ? 'record' : 'records'}
          </span>
        </div>

        <Table className='min-w-[820px]'>
          <TableCaption className='sr-only'>
            Customer orders with product count, order total, tax, shipping, and date.
          </TableCaption>
          <TableHeader>
            <TableRow className='border-b bg-muted/50 hover:bg-muted/50'>
              <TableHead className='h-12 px-5 text-xs font-semibold uppercase tracking-wider'>
                Customer
              </TableHead>
              <TableHead className='h-12 text-center text-xs font-semibold uppercase tracking-wider'>
                Products
              </TableHead>
              <TableHead className='h-12 text-right text-xs font-semibold uppercase tracking-wider'>
                Order Total
              </TableHead>
              <TableHead className='h-12 text-right text-xs font-semibold uppercase tracking-wider'>
                Tax
              </TableHead>
              <TableHead className='h-12 text-right text-xs font-semibold uppercase tracking-wider'>
                Shipping
              </TableHead>
              <TableHead className='h-12 px-5 text-right text-xs font-semibold uppercase tracking-wider'>
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow className='hover:bg-transparent'>
                <TableCell
                  colSpan={6}
                  className='h-32 text-center text-muted-foreground'
                >
                  No sales yet. Completed orders will appear here.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const {
                  id,
                  products,
                  orderTotal,
                  tax,
                  shipping,
                  createdAt,
                  email,
                } = order;

                return (
                  <TableRow
                    key={id}
                    className='transition-colors even:bg-muted/20 hover:bg-primary/5 dark:even:bg-muted/10 dark:hover:bg-primary/10'
                  >
                    <TableCell className='max-w-[240px] px-5 py-4 font-medium'>
                      <span className='block truncate' title={email}>
                        {email}
                      </span>
                    </TableCell>
                    <TableCell className='text-center'>
                      <span className='inline-flex min-w-10 items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold tabular-nums text-primary'>
                        {products}
                      </span>
                    </TableCell>
                    <TableCell className='text-right font-semibold tabular-nums'>
                      {formatCurrency(orderTotal)}
                    </TableCell>
                    <TableCell className='text-right tabular-nums text-muted-foreground'>
                      {formatCurrency(tax)}
                    </TableCell>
                    <TableCell className='text-right tabular-nums text-muted-foreground'>
                      {formatCurrency(shipping)}
                    </TableCell>
                    <TableCell className='px-5 text-right text-sm text-muted-foreground'>
                      <time dateTime={createdAt.toISOString()}>
                        {formatDate(createdAt)}
                      </time>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </section>
  );
}

export default SalesPage;
