import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

module.exports = {
  allowedDevOrigins: [
    'web.solhae.com',
    '210.119.82.84'
  ],
}

export default nextConfig;
