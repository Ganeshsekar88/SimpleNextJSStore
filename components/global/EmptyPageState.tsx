type EmptyPageStateProps = {
  title: string;
  description: string;
  message: string;
};

export default function EmptyPageState({
  title,
  description,
  message,
}: EmptyPageStateProps) {
  return (
    <section className='min-w-0 space-y-5 sm:space-y-6'>
      <header className='min-w-0 space-y-2'>
        <h1 className='break-words text-2xl font-semibold tracking-tight sm:text-3xl'>
          {title}
        </h1>
        <p className='text-sm text-muted-foreground sm:text-base'>
          {description}
        </p>
      </header>
      <p className='rounded-xl border bg-muted/20 px-4 py-6 text-sm text-muted-foreground sm:px-6 sm:py-8 sm:text-base'>
        {message}
      </p>
    </section>
  );
}
