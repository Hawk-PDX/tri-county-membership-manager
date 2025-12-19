/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tcgc.org',
      },
      {
        protocol: 'http',
        hostname: 'www.tcgc.org',
      },
    ],
  },
};

export default nextConfig;
