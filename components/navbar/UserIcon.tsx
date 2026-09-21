import { LuUser } from 'react-icons/lu';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
async function UserIcon() {
  const user = await currentUser();
  console.log('user', user);
  const profileImage = user?.imageUrl;
  if (profileImage)
    return (
      <img src={profileImage} className='w-6 h-6 rounded-full object-cover' alt="user-icon" />
    );
  return <LuUser className='w-6 h-6 bg-primary rounded-full text-white' />;
}
export default UserIcon;