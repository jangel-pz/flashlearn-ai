/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    // Aumentado limite de MB en peticiones de Server Actions
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
