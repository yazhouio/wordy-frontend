/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => [
        {
            source: '/api/:path*',
            destination: process.env.NEXT_PUBLIC_ENDPOINT + '/api/:path*',
        },
    ],
}

module.exports = nextConfig
