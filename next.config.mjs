/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // The PDF report reads its fonts from disk at request time.
    outputFileTracingIncludes: {
      '/api/report': ['./assets/fonts/*.ttf'],
    },
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
};

export default nextConfig;
