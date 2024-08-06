/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/discussion-page",
  output: "export",
  images: {
    domains: ['picky-app.s3-ap-southeast-1.amazonaws.com'],
  },
};

module.exports = nextConfig;