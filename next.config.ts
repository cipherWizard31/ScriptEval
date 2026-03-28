import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    '@embedpdf/core',
    '@embedpdf/engines',
    '@embedpdf/plugin-document-manager',
    '@embedpdf/plugin-viewport',
    '@embedpdf/plugin-scroll',
    '@embedpdf/plugin-render',
    '@embedpdf/plugin-selection',
    '@embedpdf/plugin-interaction-manager',
    '@embedpdf/plugin-redaction',
    '@embedpdf/plugin-export',
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', 
    },
    }
  };

export default nextConfig;