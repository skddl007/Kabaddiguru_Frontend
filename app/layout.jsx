import { Inter } from 'next/font/google'
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from "@/contexts/UserContext"
import ClientGlobalUI from "@/components/ClientGlobalUI"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "KabaddiGuru - Intelligent Sports Analytics",
  description: "AI-powered KabaddiGuru analytics and insights platform",
  icons: {
    icon: '/KabaddiGuru Logo.jpeg',
    shortcut: '/KabaddiGuru Logo.jpeg',
    apple: '/KabaddiGuru Logo.jpeg',
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <UserProvider>
          {children}
          <ClientGlobalUI />
          <Toaster />
        </UserProvider>
      </body>
    </html>
  )
}
