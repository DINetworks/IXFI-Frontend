/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  transpilePackages: ['@0xsquid/ui', '@0xsquid/squid-types'],
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    // Handle SSR issues with browser-only modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false
    }

    return config
  }
}
