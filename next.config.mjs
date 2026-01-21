/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/congressmen",
        permanent: false,
      },
      {
        source: "/sections",
        destination: "/sections/congressmen",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
