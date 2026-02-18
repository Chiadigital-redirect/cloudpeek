/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // allow base64 data URLs in preview
  },
  // Required for canvas-confetti (client-only)
  experimental: {},
};

export default nextConfig;
