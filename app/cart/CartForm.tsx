import CartItemsList from '@/components/cart/CartItemList';
import CartTotals from '@/components/cart/CartTotals';
import SectionTitle from '@/components/global/SectionTitle';

import { fetchOrCreateCart, updateCart, fetchCartItems } from '@/utils/actions';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

async function CartPage() {
  // const { userId } = await auth();
  // if (!userId) redirect('/');
  const numItemsInCart = await fetchCartItems();
  if (numItemsInCart === 0) {
    return <SectionTitle text='Empty cart' />;
  }

  const previousCart = await fetchOrCreateCart({ userId });
  const { cartItems, currentCart } = await updateCart(previousCart);


  return (
    <>
      <SectionTitle text='Shopping Cart' />
      <div className='mt-8 grid gap-4 lg:grid-cols-12'>
        <div className='lg:col-span-8'>
          <CartItemsList cartItems={cartItems} />
        </div>
        <div className='lg:col-span-4 lg:pl-4'>
          <CartTotals cart={currentCart} />
        </div>
      </div>
    </>
  );
}
export default CartPage;