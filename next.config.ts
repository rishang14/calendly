import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
  remotePatterns:[
    {
      protocol:"https", 
      hostname:"lh3.googleusercontent.com", 
      pathname: '/**',
    }
  ]
  }, 
   typescript: {
    ignoreBuildErrors: true, 
  },
  eslint: {
    ignoreDuringBuilds: true, 
  },
};

export default nextConfig;
