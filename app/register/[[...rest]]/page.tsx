
import { SignUp } from '@clerk/nextjs';

const RegisterPage = () => {
  return (
    <div className='flex flex-col items-center justify-center py-2'>


      <SignUp
      //  path="/register" routing="path" signInUrl="/login" 
      />
    </div>
  );
};

export default RegisterPage;
