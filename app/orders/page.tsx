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
import PaginationControls from '@/components/admin/PaginationControls';
import OrderProducts from '@/components/orders/OrderProducts';
import { fetchUserOrdersPage } from '@/utils/actions';
import { ORDERS_PAGE_SIZE } from '@/utils/pagination';
import { formatCurrency, formatDate } from '@/utils/format';
import { redirect } from 'next/navigation';

async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const { page } = await searchParams;
  const pageValue = Array.isArray(page) ? page[0] : page;
  const requestedPage = Number.parseInt(pageValue ?? '1', 10);
  const data = await fetchUserOrdersPage(requestedPage);
  console.log('OrdersPage data:', data);
  const { orders, totalItems, currentPage, totalPages } = data;
  if (requestedPage !== currentPage) {
    redirect(currentPage === 1 ? '/orders' : `/orders?page=${currentPage}`);
  }

  return (
    <section className='min-w-0 space-y-6 sm:space-y-8'>
      <header className='flex flex-col gap-6 rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-8'>
        <div className='space-y-2'>
          <p className='text-sm font-semibold uppercase tracking-[0.18em] text-primary'>
            Purchase history
          </p>
          <h1 className='break-words text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl'>
            Your Orders
          </h1>
          <p className='max-w-xl text-sm text-muted-foreground sm:text-base'>
            Review your past purchases and order totals.
          </p>
        </div>
        <div className='flex w-fit items-center gap-3 rounded-xl border bg-background/80 px-4 py-3 shadow-sm'>
          <span className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg font-semibold text-primary'>
            {totalItems}
          </span>
          <span className='text-sm font-medium text-muted-foreground'>
            {totalItems === 1 ? 'order placed' : 'orders placed'}
          </span>
        </div>
      </header>

      <Card className='min-w-0 overflow-hidden rounded-2xl shadow-sm'>
        <div className='flex flex-col gap-1 border-b bg-muted/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
          <div>
            <h2 className='font-semibold tracking-tight'>Order history</h2>
            <p className='text-sm text-muted-foreground'>Your completed purchases</p>
          </div>
          <span className='text-sm tabular-nums text-muted-foreground'>
            {totalItems} {totalItems === 1 ? 'record' : 'records'}
          </span>
        </div>

        <div className='divide-y md:hidden'>
          {orders.length === 0 ? (
            <p className='px-5 py-10 text-center text-sm text-muted-foreground'>
              No orders yet. Your purchases will appear here.
            </p>
          ) : (
            // orders.map(({ id, products, orderItems, orderTotal, tax, shipping, createdAt }) => (
            orders.map(({
              id,
              products,
              orderItems,
              orderTotal,
              tax,
              shipping,
              createdAt,
              paymentId,
              paymentMethod
            }) => (
              <article key={id} className='min-w-0 space-y-4 p-4 sm:p-5'>
                <div className='flex items-start justify-between gap-4'>
                  <div className='min-w-0 flex-1'>
                    <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>Products</p>
                    <div className='mt-2'>
                      <OrderProducts items={orderItems} legacyCount={products} />
                    </div>
                  </div>
                  <div className='min-w-0 text-right'>
                    <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>Order total</p>
                    <p className='break-words text-base font-semibold tabular-nums'>{formatCurrency(orderTotal)}</p>
                  </div>
                </div>
                <div className='grid min-w-0 grid-cols-2 gap-x-4 gap-y-3 text-sm'>
                  <div className='min-w-0'>
                    <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>Tax</p>
                    <p className='break-words tabular-nums text-muted-foreground'>{formatCurrency(tax)}</p>
                  </div>
                  <div className='min-w-0 text-right'>
                    <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>Shipping</p>
                    <p className='break-words tabular-nums text-muted-foreground'>{formatCurrency(shipping)}</p>
                  </div>
                </div>
                <div className='grid min-w-0 grid-cols-2 gap-x-4 gap-y-3 text-sm border-t pt-3'>

                  <div className='min-w-0'>
                    <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                      Payment Method
                    </p>

                    <p className='mt-1 font-medium capitalize'>
                      {paymentMethod ?? 'N/A'}
                    </p>
                  </div>

                  <div className='min-w-0'>
                    <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                      Payment ID
                    </p>

                    <p
                      className='mt-1 break-all text-xs text-muted-foreground'
                      title={paymentId ?? 'N/A'}
                    >
                      {paymentId ?? 'N/A'}
                    </p>
                  </div>

                </div>
                <div className='flex items-center justify-between gap-3 border-t pt-3 text-sm'>
                  <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>Date</p>
                  <time className='text-right text-muted-foreground' dateTime={createdAt.toISOString()}>
                    {formatDate(createdAt)}
                  </time>
                </div>

              </article>
            ))
          )}
        </div>

        <div className='hidden max-w-full overflow-x-auto md:block'>
          <Table className='min-w-[1100px]'>
            <TableCaption className='sr-only'>
              Your past orders, including products and quantities, totals, tax, shipping, and date.
            </TableCaption>
            <TableHeader>
              <TableRow className='border-b bg-muted/50 hover:bg-muted/50'>
                <TableHead className='h-12 px-5 text-xs font-semibold uppercase tracking-wider'>
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
                <TableHead className='h-12 text-center text-xs font-semibold uppercase tracking-wider'>
                  Payment Method
                </TableHead>

                <TableHead className='h-12 px-5 text-right text-xs font-semibold uppercase tracking-wider'>
                  Payment ID
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
                    colSpan={7}
                    className='h-32 text-center text-muted-foreground'
                  >
                    No orders yet. Your purchases will appear here.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => {
                  const {
                    id,
                    products,
                    orderItems,
                    orderTotal,
                    tax,
                    shipping,
                    createdAt,
                    paymentId,
                    paymentMethod,
                  } = order;

                  return (
                    <TableRow
                      key={id}
                      className='transition-colors even:bg-muted/20 hover:bg-primary/5 dark:even:bg-muted/10 dark:hover:bg-primary/10'
                    >
                      <TableCell className='min-w-[150px] max-w-[300px] px-3 py-4 align-top'>
                        <OrderProducts items={orderItems} legacyCount={products} />
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
                      <TableCell className='text-center'>
                        <span className='inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary'>
                          {paymentMethod ?? 'N/A'}
                        </span>
                      </TableCell>

                      <TableCell className='max-w-[200px] px-5 text-right'>
                        <span
                          className='block truncate text-xs text-muted-foreground'
                          title={paymentId ?? 'N/A'}
                        >
                          {paymentId ?? 'N/A'}
                        </span>
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
        </div>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={ORDERS_PAGE_SIZE}
          href='/orders'
          itemLabel='orders'
        />
      </Card>
    </section>
  );
}
export default OrdersPage;
