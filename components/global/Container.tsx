import {cn} from '@/lib/utils';


const Container = ( { children, className } :{ children: React.ReactNode; className?: string } ) => {
  return (
  <div className={cn('mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 xl:max-w-7xl', className)}>{children}</div>
  );
};
export default Container;
