import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      {
        source: '/session',
        destination: 'https://portal.mastermindshq.business/',
        permanent: true,
      },
      {
        source: '/session/:path*',
        destination: 'https://portal.mastermindshq.business/',
        permanent: true,
      },
      {
        source: '/resource-vault',
        destination: 'https://portal.mastermindshq.business/',
        permanent: true,
      },
      {
        source: '/resource-vault/:path*',
        destination: 'https://portal.mastermindshq.business/',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
