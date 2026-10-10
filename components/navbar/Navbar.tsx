import Container from "@/components/global/Container";
import Logo from "./Logo";
import NavSearch from "./NavSearch";
import CartButton from "./CartButton";
import DarkMode from "./DarkMode";
import LinksDropDown from "./LinksDropDown";
import { Suspense } from 'react';
import LoadingContainer from '@/components/global/LoadingContainer';

const Navbar = () => {
  return <nav className='border-b'>
    <Container className='flex flex-col sm:flex-row sm:justify-between sm:items-center flex-wrap py-8 gap-4'>
      <Logo></Logo>
      <Suspense fallback={<LoadingContainer />}>
        <NavSearch />
      </Suspense>
      <div className='flex gap-4 items-center'>
        <Suspense>
          <CartButton />
        </Suspense>
        <DarkMode />
        <Suspense fallback={<LoadingContainer />}>
          <LinksDropDown />
        </Suspense>
      </div>
    </Container>
  </nav>;
};
export default Navbar;