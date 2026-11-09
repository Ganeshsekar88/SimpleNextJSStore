
import { SignIn } from '@clerk/nextjs';
import DemoLoginButton from '@/components/auth/DemoLoginButton';

const LoginPage = () => {
    return (
        <div className='flex flex-col items-center justify-center gap-4 py-2'>
            <SignIn
            //    path="/login" routing="path" signUpUrl="/register"
            />
            {process.env.NEXT_PUBLIC_DEMO_LOGIN_ENABLED === 'true' && (
                <section className='w-full max-w-[400px] rounded-xl border bg-card p-5 text-center shadow-sm'>
                    <h2 className='text-lg font-semibold'>Explore the demo</h2>
                    <p className='mt-1 text-sm text-muted-foreground'>
                        Continue with a demo admin session.
                    </p>
                    <DemoLoginButton />
                </section>
            )}
        </div>
    );
};

export default LoginPage;

