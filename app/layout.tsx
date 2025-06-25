import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { GlobalSearch } from "@/components/global-search"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GreenScape Professional",
  description: "Professional Landscaping Management System",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <div className="flex min-h-screen bg-slate-50/30">
              <AppSidebar />
              <main className="flex-1 overflow-auto w-full lg:w-auto">
                {/* Global Search - Desktop Header */}
                <div className="hidden lg:block sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-slate-200/60 p-4">
                  <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex-1 max-w-md">
                      <Suspense>
                        <GlobalSearch />
                      </Suspense>
                    </div>
                  </div>
                </div>

                {/* Mobile Search Header */}
                <div className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-slate-200/60 p-4 pt-16">
                  <Suspense>
                    <GlobalSearch />
                  </Suspense>
                </div>

                {/* Page Content */}
                <div className="relative">
                  <div className="p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                      <BreadcrumbNav />
                      {children}
                    </div>
                  </div>
                </div>
              </main>
            </div>
            <MobileBottomNav />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
