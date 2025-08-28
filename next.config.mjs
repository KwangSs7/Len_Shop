/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      },
    ],
  },
  eslint: {
    // Cho phép build ngay cả khi còn lỗi lint
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
