import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hoodie Hut - Agent-Ready Store',
  description: 'Simple demo store optimized for AI agents. Buy hoodies with ease.',
  keywords: 'hoodies, clothing, ai agents, demo store',
  robots: 'index, follow',
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