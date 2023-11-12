import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { getAuthenticatedAppForUser } from "@/lib/firebase/firebase";

import { SideNavBar } from '@/components/SideNavBar'

const inter = Inter({ 
  subsets: ['latin'],
  variable: "--font-sans" 
})

export const metadata: Metadata = {
  title: 'Temple Tablets CRM',
  description: 'Custom CRM For Temple Tablets, Built with Next.js and Firebase',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getAuthenticatedAppForUser();
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          "bg-background font-sans antialiased h-full",
          inter.variable
        )}
      >
        <>
      <div className="md:block h-full">
        <div className="border-t h-full">
          <div className="bg-background h-full">
            <div className="grid lg:grid-cols-5 h-full">
              <SideNavBar className="hidden lg:block" user={currentUser} />
              <div className="col-span-3 lg:col-span-4 lg:border-l p-5">
              {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
        
      </body>
    </html>
  )
}
