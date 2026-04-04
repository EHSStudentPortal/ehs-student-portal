/** @type {import('next').NextConfig} */
const isProd = process.env.GITHUB_ACTIONS === 'true';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isProd ? '/ehs-student-portal' : '',
  assetPrefix: isProd ? '/ehs-student-portal/' : '',
};

export default nextConfig;
