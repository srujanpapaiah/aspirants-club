/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
  },
  experimental: {
    appDir: true,
  },
}

export default nextConfig;