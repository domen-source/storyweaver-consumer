/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['pastel-book-maker.lovable.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig

