'use client';

import { ReloadIcon } from '@radix-ui/react-icons';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SignInButton } from '@clerk/nextjs';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

type btnSize = 'default' | 'lg' | 'sm';

type SubmitButtonProps = {
  className?: string;
  text?: string;
  size?: btnSize;
};

export function SubmitButton({
  className = '',
  text = 'submit',
  size = 'lg',
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type='submit'
      disabled={pending}
      className={cn('capitalize', className)}
      size={size}
    >
      {pending ? (
        <>
          <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
          Please wait...
        </>
      ) : (
        text
      )}
    </Button>
  );
}


export const CardSubmitButton = ({ isFavorite }: { isFavorite: boolean }) => {
  const { pending } = useFormStatus();
  const label = isFavorite ? 'Remove from favorites' : 'Add to favorites';

  return (
    <Button
      type='submit'
      size='icon'
      variant='outline'
      className=' p-2 cursor-pointer'
      aria-label={label}
    >
      {pending ? (
        <ReloadIcon className=' animate-spin' />
      ) : isFavorite ? (
        <FaHeart />
      ) : (
        <FaRegHeart />
      )}
    </Button>
  );
};

export const CardSignInButton = ({ redirectUrl }: { redirectUrl?: string }) => {
  return (
    <SignInButton
      mode='modal'
      forceRedirectUrl={redirectUrl}
      signUpForceRedirectUrl={redirectUrl}
    >
      <Button
        type='button'
        size='icon'
        variant='outline'
        className='p-2 cursor-pointer'
        aria-label='Sign in to add to favorites'
      >
        <FaRegHeart />
      </Button>
    </SignInButton>
  );
};

// export const ProductSignInButton = ({ redirectUrl }: { redirectUrl?: string }) => {
//   return (
//     <SignInButton
//       mode='modal'
//       forceRedirectUrl={redirectUrl}
//       signUpForceRedirectUrl={redirectUrl}
//     >
//       <Button type='button' size='default' className='mt-8'>
//         Please Sign In
//       </Button>
//     </SignInButton>
//   );
// };


import { SignIn } from "@clerk/nextjs";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import DemoLoginButton from '../auth/DemoLoginButton';


export const ProductSignInButton = ({
  redirectUrl,
}: {
  redirectUrl?: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" size="default" className="mt-8">
          Please Sign In
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-[450px] overflow-y-auto p-0">

        <div className="flex flex-col items-center justify-center gap-4 p-4">

          {/* Clerk Sign In */}
          <SignIn
            routing="hash"
            forceRedirectUrl={redirectUrl}
            signUpForceRedirectUrl={redirectUrl}
          />

          {/* Demo Login */}
          {process.env.NEXT_PUBLIC_DEMO_LOGIN_ENABLED === "true" && (
            <section className="w-full max-w-[400px] rounded-xl border bg-card p-5 text-center shadow-sm">

              <h2 className="text-lg font-semibold">
                Explore the demo
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Continue with a demo admin session.
              </p>

              <div className="mt-4">
                <DemoLoginButton />
              </div>

            </section>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
};


// import {
//   Dialog,
//   DialogContent,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// import { SignIn } from "@clerk/nextjs";
// import DemoLoginButton from '../auth/DemoLoginButton';

// export const ProductSignInButton = ({
//   redirectUrl,
// }: {
//   redirectUrl?: string;
// }) => {
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button type="button" size="default" className="mt-8">
//           Please Sign In
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="max-w-[450px] p-0 overflow-y-auto max-h-[90vh]">

//         {/* Clerk Sign In */}
//         <div className="flex justify-center pt-4">
//           <SignIn
//             routing="hash"
//             forceRedirectUrl={redirectUrl}
//             signUpForceRedirectUrl={redirectUrl}
//           />
//         </div>

//         {/* Demo Login */}
//         {process.env.NEXT_PUBLIC_DEMO_LOGIN_ENABLED === "true" && (
//           <section className="w-full border-t p-5 text-center">

//             <h2 className="text-lg font-semibold">
//               Explore the demo
//             </h2>

//             <p className="mt-1 text-sm text-muted-foreground">
//               Continue with a demo admin session.
//             </p>

//             <div className="mt-4">
//               <DemoLoginButton />
//             </div>

//           </section>
//         )}

//       </DialogContent>
//     </Dialog>
//   );
// };