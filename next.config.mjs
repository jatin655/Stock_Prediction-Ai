/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    // Use a different hash function to avoid WasmHash issues
    config.output.hashFunction = 'xxhash64';
    return config;
  },
}

export default nextConfig
