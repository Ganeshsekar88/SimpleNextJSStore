import Container from '@/components/global/Container';
import { links } from '@/utils/link';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { LuArrowUpRight, LuShoppingBag } from 'react-icons/lu';
import CurrentYear from '@/components/global/CurrentYear';

const exploreLabels = new Set(['home', 'about', 'products']);
const accountLabels = new Set(['favorites', 'cart', 'orders', 'reviews']);

function FooterLinks({
  heading,
  items,
}: {
  heading: string;
  items: { href: string; label: string }[];
}) {
  
  return (
    <section aria-label={heading}>
      <h2 className='text-sm font-semibold uppercase tracking-[0.16em] text-foreground'>
        {heading}
      </h2>
      <ul className='mt-5 space-y-3'>
        {items.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className='text-sm capitalize text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

async function Footer() {
  const { userId } = await auth();
  const isAdmin =
    userId === process.env.ADMIN1_USER_ID ||
    userId === process.env.ADMIN2_USER_ID;
  const exploreLinks = links.filter(({ label }) => exploreLabels.has(label));
  const accountLinks = links.filter(({ label }) => accountLabels.has(label));
  const dashboardLink = links.find(({ label }) => label === 'dashboard');

  return (
    <footer className='border-t border-border bg-background text-foreground'>
      <Container className='py-12 sm:py-14'>
        <div className='grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12'>
          <div className='max-w-sm'>
            <Link
              href='/'
              className='inline-flex items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              aria-label='Next Storefront home'
            >
              <span className='flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground'>
                <LuShoppingBag className='size-5' aria-hidden='true' />
              </span>
              <span className='text-base font-semibold tracking-tight'>
                Next Storefront
              </span>
            </Link>
            <p className='mt-5 text-sm leading-6 text-muted-foreground'>
              A simple place to discover products, save your favorites, and
              keep track of your orders.
            </p>
            <Link
              href='/products'
              className='mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            >
              Browse all products
              <LuArrowUpRight className='size-4' aria-hidden='true' />
            </Link>
          </div>

          <FooterLinks heading='Explore' items={exploreLinks} />
          <FooterLinks heading='Your store' items={accountLinks} />

          <section aria-label='Account'>
            <h2 className='text-sm font-semibold uppercase tracking-[0.16em] text-foreground'>
              Account
            </h2>
            <ul className='mt-5 space-y-3'>
              <li>
                <Link
                  href='/login'
                  className='text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  href='/register'
                  className='text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                >
                  Create account
                </Link>
              </li>
              {isAdmin && dashboardLink && (
                <li>
                  <Link
                    href={dashboardLink.href}
                    className='text-sm capitalize text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                  >
                    {dashboardLink.label}
                  </Link>
                </li>
              )}
            </ul>
          </section>
        </div>

        <div className='mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between'>
          <p>© <CurrentYear /> Next Storefront. All rights reserved.</p>
          <p>Thoughtful shopping, made simple.</p>
        </div>
      </Container>
    </footer>
  );
}
export default Footer;
