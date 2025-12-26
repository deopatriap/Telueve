/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', '@types/three', '@react-three/fiber', '@react-three/drei'],
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
