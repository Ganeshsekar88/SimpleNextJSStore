
import { SignIn } from '@clerk/nextjs';

const LoginPage = () => {
  return (
    <div className='flex flex-col items-center justify-center py-2'>
      

      <SignIn
    //    path="/login" routing="path" signUpUrl="/register"
       />
    </div>
  );
};

export default LoginPage;

