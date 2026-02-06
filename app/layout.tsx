import type { Metadata } from 'next'
import { Poppins, Quicksand } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

const quicksand = Quicksand({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-quicksand',
})

export const metadata: Metadata = {
  title: 'Personalized Gift Books | Create Your Story',
  description: 'Create personalized storybooks that spark magic',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${quicksand.variable} font-sans`}>
        {children}
        <Footer />
      </body>
    </html>
  )
}
