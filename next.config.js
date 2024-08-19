/** @type {import('next').NextConfig} */
const nextConfig = {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "**",
    },
  ],
};

module.exports = nextConfig;