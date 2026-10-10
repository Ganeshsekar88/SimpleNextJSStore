import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { LuAlignLeft } from 'react-icons/lu';
import Link from 'next/link';
import { Button } from '../ui/button';
import { links } from '@/utils/link';
import UserIcon from './UserIcon';
import SignOutLink from './SignOutLink';
import { SignInButton, SignUpButton, Show } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

async function LinksDropdown() {
  const { userId } = await auth();
  const isAdmin = userId === process.env.ADMIN1_USER_ID || userId === process.env.ADMIN2_USER_ID;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className='flex gap-4 max-w-[100px]'
          aria-label='Open account menu'
        >
          <LuAlignLeft className='w-6 h-6' aria-hidden='true' />
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-48' align='start' sideOffset={10}>
        <Show when='signed-out'>
          <DropdownMenuItem>
            <SignInButton>
              <Link className='w-full text-left' href='/login'>
                Login
              </Link>
            </SignInButton>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <SignUpButton>
              <Link className='w-full text-left' href='/register'>
                Register
              </Link>
            </SignUpButton>
          </DropdownMenuItem>
        </Show>

        <Show when='signed-in'>
          {links.map((link) => {
            if (link.label === 'dashboard' && !isAdmin) return null;

            return (
              <DropdownMenuItem key={link.href}>
                <Link href={link.href} className='capitalize w-full'>
                  {link.label}
                </Link>
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <SignOutLink />
          </DropdownMenuItem>
        </Show>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LinksDropdown;