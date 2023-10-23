/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => [
        {
            source: '/api/:path*',
            destination: process.env.NEXT_PUBLIC_API_URL + '/:path*',
        },
        {
            source: '/ws',
            destination: process.env.NEXT_PUBLIC_WS_URL,
        }
    ],
}

module.exports = nextConfig
