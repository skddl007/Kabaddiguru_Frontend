import { Inter } from 'next/font/google'
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from "@/contexts/UserContext"
import ClientGlobalUI from "@/components/ClientGlobalUI"
import ErrorBoundary from "@/components/ErrorBoundary"

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Chunk loading error handler
              window.addEventListener('error', function(e) {
                if (e.message && e.message.includes('Loading chunk')) {
                  console.warn('Chunk loading error detected, attempting to reload...');
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }
              });
              
              // Handle unhandled promise rejections for chunk loading
              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason && e.reason.message && e.reason.message.includes('Loading chunk')) {
                  console.warn('Chunk loading promise rejection detected, attempting to reload...');
                  e.preventDefault();
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }
              });
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <UserProvider>
            {children}
            <ClientGlobalUI />
            <Toaster />
          </UserProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
