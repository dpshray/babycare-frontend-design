import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '192.168.100.23',
                port: '8008',
                pathname: '/storage/**',
            },
            {
                protocol: 'https',
                hostname: 'marketplace.thebabycareapp.com',
                pathname: '/storage/**',
            },
        ],
    },
};

export default nextConfig;
