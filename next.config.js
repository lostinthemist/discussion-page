/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/discussion-page",
  images: {
    domains: ['picky-app.s3-ap-southeast-1.amazonaws.com'],
  },
};

module.exports = nextConfig;