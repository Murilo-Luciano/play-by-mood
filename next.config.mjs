/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
    // Share images read these with fs at request time; file tracing can't see
    // `process.cwd()` paths, so ship them with the functions explicitly.
    outputFileTracingIncludes: {
      "/games/[mood]/opengraph-image": ["./assets/fonts/*.ttf", "./public/*.png"],
      "/opengraph-image": ["./assets/fonts/*.ttf"],
    },
  },
  images: {
    domains: ["media.rawg.io"],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
