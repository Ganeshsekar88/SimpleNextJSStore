import Link from 'next/link';
import { Button } from '../ui/button';
import { VscCode } from 'react-icons/vsc';

function Logo() {
  return (
    <Button size='icon' asChild>
      <Link href='/' aria-label='Next Storefront home'>
        <VscCode className='w-6 h-6' aria-hidden='true' />
      </Link>
    </Button>
  );
}

export default Logo;
