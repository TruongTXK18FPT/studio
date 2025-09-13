import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'file3.qdnd.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'baotintuc.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'photo-baomoi.bmcdn.me',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tphcm.chinhphu.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.vneconomy.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdnmedia.baotintuc.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img-s-msn-com.akamaized.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'nld.mediacdn.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'danviet.mediacdn.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdnimg.vietnamplus.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images2.thanhnien.vn',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
