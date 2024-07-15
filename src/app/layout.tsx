import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Inter } from 'next/font/google'
import UserDataSaver from '../components/UserDataSaver'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Aspirants Club',
  description: 'Collaborate, Share, and Excel in Your Exam Preparation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <UserDataSaver />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}