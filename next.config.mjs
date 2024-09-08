/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  images: {
    domains: ["media.rawg.io"],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
