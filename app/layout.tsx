import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CrystalStock AI - Ethereal Market Intelligence',
  description: 'Experience the tranquil power of ethereal market analysis. Our crystalline AI platform brings serene precision to stock predictions through advanced neural networks.',
  generator: 'CrystalStock AI',
  keywords: 'stock prediction, AI, neural networks, market analysis, ethereal, crystalline',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
