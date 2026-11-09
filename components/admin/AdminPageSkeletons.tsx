import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function PageIntroSkeleton({ kind }: { kind: 'products' | 'sales' | 'edit' }) {
  return (
    <header className='flex flex-col gap-6 rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-8'>
      <div className='w-full min-w-0 space-y-2' aria-hidden='true'>
        <Skeleton className='h-4 w-36' />
        <Skeleton className='h-8 w-44 sm:h-9 sm:w-52' />
        <Skeleton className='h-4 w-full max-w-xl' />
      </div>
      <div
        className={`flex w-full items-center gap-3 sm:w-auto ${kind === 'products' ? 'flex-col sm:flex-row' : 'justify-start sm:justify-end'}`}
        aria-hidden='true'
      >
        {kind === 'products' && (
          <Skeleton className='h-11 w-28 rounded-xl' />
        )}
        {kind === 'sales' && (
          <Skeleton className='h-16 w-48 rounded-xl' />
        )}
        {kind === 'edit' && (
          <Skeleton className='h-10 w-40 rounded-md' />
        )}
        {kind === 'products' && (
          <Skeleton className='h-10 w-full rounded-md sm:w-32' />
        )}
      </div>
    </header>
  );
}

function CatalogPanelHeaderSkeleton() {
  return (
    <div className='flex flex-col gap-2 border-b bg-muted/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
      <div className='space-y-2' aria-hidden='true'>
        <Skeleton className='h-5 w-36' />
        <Skeleton className='h-4 w-52 max-w-full' />
      </div>
      <Skeleton className='h-4 w-20' aria-hidden='true' />
    </div>
  );
}

function PaginationSkeleton() {
  return (
    <div className='flex flex-col gap-3 border-t bg-muted/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6' aria-hidden='true'>
      <Skeleton className='h-4 w-36' />
      <div className='flex items-center gap-2'>
        <Skeleton className='h-8 w-16' />
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-8 w-12' />
      </div>
    </div>
  );
}

function ProductMobileRows() {
  return (
    <div className='divide-y md:hidden' aria-hidden='true'>
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className='space-y-3 p-4 sm:p-5'>
          <Skeleton className='h-5 w-3/4 max-w-64' />
          <div className='flex items-start justify-between gap-4'>
            <div className='min-w-0 flex-1 space-y-2'>
              <Skeleton className='h-3 w-16' />
              <Skeleton className='h-4 w-28 max-w-full' />
            </div>
            <div className='shrink-0 space-y-2 text-right'>
              <Skeleton className='ml-auto h-3 w-10' />
              <Skeleton className='ml-auto h-4 w-16' />
            </div>
          </div>
          <div className='flex justify-end gap-2 border-t pt-3'>
            <Skeleton className='h-9 w-9' />
            <Skeleton className='h-9 w-9' />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductDesktopRows() {
  return (
    <div className='hidden overflow-x-auto md:block' aria-hidden='true'>
      <div className='min-w-[640px]'>
        <div className='grid grid-cols-[2fr_1.5fr_1fr_1fr] items-center gap-4 border-b bg-muted/50 px-5 py-3'>
          <Skeleton className='h-3 w-24' />
          <Skeleton className='h-3 w-16' />
          <Skeleton className='ml-auto h-3 w-12' />
          <Skeleton className='ml-auto h-3 w-16' />
        </div>
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className='grid grid-cols-[2fr_1.5fr_1fr_1fr] items-center gap-4 border-b px-5 py-4 last:border-0'
          >
            <Skeleton className='h-4 w-40 max-w-full' />
            <Skeleton className='h-4 w-24 max-w-full' />
            <Skeleton className='ml-auto h-4 w-16' />
            <div className='flex justify-end gap-1'>
              <Skeleton className='h-9 w-9' />
              <Skeleton className='h-9 w-9' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminProductsSkeleton() {
  return (
    <section className='min-w-0 space-y-6 sm:space-y-8' aria-busy='true' aria-label='Loading product list'>
      <PageIntroSkeleton kind='products' />
      <Card className='min-w-0 overflow-hidden rounded-2xl shadow-sm'>
        <CatalogPanelHeaderSkeleton />
        <ProductMobileRows />
        <ProductDesktopRows />
        <PaginationSkeleton />
      </Card>
    </section>
  );
}

function SalesMobileRows() {
  return (
    <div className='divide-y md:hidden' aria-hidden='true'>
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className='min-w-0 space-y-4 p-4 sm:p-5'>
          <div className='space-y-2'>
            <Skeleton className='h-3 w-16' />
            <Skeleton className='h-4 w-52 max-w-full' />
          </div>
          <div className='grid grid-cols-2 gap-x-4 gap-y-3'>
            {Array.from({ length: 4 }, (_, valueIndex) => (
              <div key={valueIndex} className='min-w-0 space-y-2'>
                <Skeleton className='h-3 w-16 max-w-full' />
                <Skeleton className='h-4 w-20 max-w-full' />
              </div>
            ))}
          </div>
          <div className='flex items-center justify-between gap-3 border-t pt-3'>
            <Skeleton className='h-3 w-10' />
            <Skeleton className='h-4 w-32 max-w-[70%]' />
          </div>
        </div>
      ))}
    </div>
  );
}

function SalesDesktopRows() {
  return (
    <div className='hidden overflow-x-auto md:block' aria-hidden='true'>
      <div className='min-w-[820px]'>
        <div className='grid grid-cols-[2fr_0.8fr_1.2fr_1fr_1.2fr_1.4fr] items-center gap-4 border-b bg-muted/50 px-5 py-3'>
          {['Customer', 'Products', 'Order total', 'Tax', 'Shipping', 'Date'].map((label) => (
            <Skeleton key={label} className='h-3 w-16 max-w-full' />
          ))}
        </div>
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className='grid grid-cols-[2fr_0.8fr_1.2fr_1fr_1.2fr_1.4fr] items-center gap-4 border-b px-5 py-4 last:border-0'
          >
            <Skeleton className='h-4 w-40 max-w-full' />
            <Skeleton className='mx-auto h-8 w-10 rounded-full' />
            <Skeleton className='ml-auto h-4 w-20' />
            <Skeleton className='ml-auto h-4 w-16' />
            <Skeleton className='ml-auto h-4 w-20' />
            <Skeleton className='ml-auto h-4 w-28 max-w-full' />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminSalesSkeleton() {
  return (
    <section className='min-w-0 space-y-6 sm:space-y-8' aria-busy='true' aria-label='Loading sales'>
      <PageIntroSkeleton kind='sales' />
      <Card className='min-w-0 overflow-hidden rounded-2xl shadow-sm'>
        <CatalogPanelHeaderSkeleton />
        <SalesMobileRows />
        <SalesDesktopRows />
        <PaginationSkeleton />
      </Card>
    </section>
  );
}

function FormFieldSkeleton() {
  return (
    <div className='space-y-2' aria-hidden='true'>
      <Skeleton className='h-4 w-24' />
      <Skeleton className='h-9 w-full' />
    </div>
  );
}

export function AdminProductEditSkeleton() {
  return (
    <section className='min-w-0 space-y-6 sm:space-y-8' aria-busy='true' aria-label='Loading product editor'>
      <PageIntroSkeleton kind='edit' />
      <div className='grid min-w-0 gap-4 sm:gap-6 xl:grid-cols-3'>
        <Card className='h-fit min-w-0 overflow-hidden rounded-2xl shadow-sm'>
          <div className='space-y-2 border-b bg-muted/30 px-5 py-4 sm:px-6' aria-hidden='true'>
            <Skeleton className='h-5 w-28' />
            <Skeleton className='h-4 w-52 max-w-full' />
          </div>
          <div className='space-y-4 p-5 sm:p-6' aria-hidden='true'>
            <Skeleton className='aspect-square h-auto w-full max-w-[200px] rounded-xl' />
            <Skeleton className='h-8 w-32 rounded-md' />
          </div>
        </Card>

        <Card className='min-w-0 overflow-hidden rounded-2xl shadow-sm xl:col-span-2'>
          <div className='space-y-2 border-b bg-muted/30 px-5 py-4 sm:px-6' aria-hidden='true'>
            <Skeleton className='h-5 w-32' />
            <Skeleton className='h-4 w-64 max-w-full' />
          </div>
          <div className='min-w-0 space-y-5 p-4 sm:p-8'>
            <div className='grid min-w-0 gap-x-6 gap-y-5 md:grid-cols-2'>
              <FormFieldSkeleton />
              <FormFieldSkeleton />
              <FormFieldSkeleton />
            </div>
            <div className='space-y-2' aria-hidden='true'>
              <Skeleton className='h-4 w-36' />
              <Skeleton className='h-32 w-full rounded-md' />
            </div>
            <div className='flex flex-col gap-3 rounded-xl border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between' aria-hidden='true'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-40' />
                <Skeleton className='h-4 w-64 max-w-full' />
              </div>
              <Skeleton className='h-10 w-24 rounded-md' />
            </div>
            <div className='flex justify-end border-t pt-6' aria-hidden='true'>
              <Skeleton className='h-10 w-40 rounded-md' />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
