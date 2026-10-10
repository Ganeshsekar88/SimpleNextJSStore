/** @type {import('next').NextConfig} */
const nextConfig = {

  cacheComponents: true,
  
  images: {
    // Serve smaller modern image formats when the browser supports them.
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      //production supabase bucket
      {
        protocol: 'https',
        hostname: 'ujbfzhyzbzatualsvbvz.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },
};

export default nextConfig;
