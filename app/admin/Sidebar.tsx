'use client';
import { adminLinks } from '@/utils/link';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className='grid grid-cols-2 gap-2 lg:flex lg:flex-col'>
      {adminLinks.map((link) => {
        const isActivePage = pathname === link.href;
        const variant = isActivePage ? 'default' : 'ghost';
        return (
          <Button
            key={link.href}
            asChild
            className='mb-0 w-full min-w-0 justify-start whitespace-normal px-3 text-left font-normal capitalize'
            variant={variant}
          >
            <Link href={link.href}>{link.label}</Link>
          </Button>
        );
      })}
    </aside>
  );
}
export default Sidebar;
