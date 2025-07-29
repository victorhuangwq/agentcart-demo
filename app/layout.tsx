import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hoodie Hut - Agent-Ready Store',
  description: 'Simple demo store optimized for AI agents. Buy hoodies with ease. API: GET /api/search, POST /api/buy',
  keywords: 'hoodies, clothing, ai agents, demo store, api, HOODIE-BLACK, HOODIE-GRAY, HOODIE-NAVY',
  robots: 'index, follow',
  other: {
    'ai-agent-instructions': 'Start at /.well-known/agent.json for API docs. Use POST /api/buy with sku, qty, pay_token',
    'api-endpoints': 'GET /api/search, POST /api/buy',
    'example-purchase': 'POST /api/buy {"sku":"HOODIE-BLACK","qty":1,"pay_token":"demo"}',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}