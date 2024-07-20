import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Inter } from 'next/font/google'
import UserDataSaver from '../components/UserDataSaver'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Aspirants Club',
  description: 'Exam preparation and information platform',
  manifest: '/manifest.json',
  themeColor: '#4A90E2',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Aspirants Club',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
      <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
        </head>
        <body className={inter.className}>
          <UserDataSaver />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}