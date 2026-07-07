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
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          has: [
            {
              type: 'host',
              value: 'decks.mastermindshq.business',
            },
          ],
          destination: '/2x-with-ai-playbook.html',
        },
        {
          source: '/',
          has: [
            {
              type: 'host',
              value: 'passiveincome.mastermindshq.business',
            },
          ],
          destination: '/ai-agent-income',
        },
      ],
    }
  },
}

export default nextConfig
