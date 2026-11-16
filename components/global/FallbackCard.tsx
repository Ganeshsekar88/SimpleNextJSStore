import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type FallbackCardProps = {
  code: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  actions: ReactNode;
  reference?: string;
  fullScreen?: boolean;
};

export default function FallbackCard({
  code,
  eyebrow,
  title,
  description,
  icon,
  actions,
  reference,
  fullScreen = false,
}: FallbackCardProps) {
  return (
    <section
      aria-labelledby='fallback-title'
      role='alert'
      className={cn(
        'relative isolate flex w-full items-center justify-center overflow-hidden px-4 py-10 sm:px-6 sm:py-16',
        fullScreen ? 'min-h-screen' : 'min-h-[55vh]'
      )}
    >
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.12),_transparent_55%)]'
      />

      <Card className='w-full max-w-xl overflow-hidden rounded-3xl border-border/70 bg-card/95 shadow-xl shadow-primary/5 backdrop-blur'>
        <div className='h-1.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40' />
        <div className='px-6 py-10 text-center sm:px-12 sm:py-14'>
          <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm'>
            {icon}
          </div>

          <div className='mt-7 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
            <span className='h-1.5 w-1.5 rounded-full bg-primary' />
            {eyebrow}
          </div>

          <h1
            id='fallback-title'
            className='mt-3 text-3xl font-semibold tracking-tight sm:text-4xl'
          >
            {title}
          </h1>
          <p className='mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base'>
            {description}
          </p>

          <div className='mt-8 flex flex-col justify-center gap-3 sm:flex-row'>
            {actions}
          </div>
        </div>

        {reference ? (
          <div className='border-t bg-muted/30 px-6 py-3 text-center text-xs text-muted-foreground'>
            Reference {reference}
          </div>
        ) : (
          <div className='border-t bg-muted/30 px-6 py-3 text-center text-xs text-muted-foreground'>
            {code} <span aria-hidden='true'>·</span> Next Storefront
          </div>
        )}
      </Card>
    </section>
  );
}
