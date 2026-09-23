/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      //production supabase bucket
      // {
      //   protocol: 'https',
      //   hostname: 'ujbfzhyzbzatualsvbvz.supabase.co',
      // },

      //test supabase bucket
       {
        protocol: 'https',
        hostname: 'gocpdhqmqqlhluoacikb.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },
};

export default nextConfig;
