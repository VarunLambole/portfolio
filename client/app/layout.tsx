import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { ErrorBoundary } from "@/components/error-boundary"

import { Inter as V0_Font_Inter, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _inter = V0_Font_Inter({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], variable: '--font-inter' })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], variable: '--font-geist-mono' })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200", "300", "400", "500", "600", "700", "800", "900"], variable: '--font-source-serif-4' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://varunlambole.dev'),
  title: {
    default: "Varun Lambole | Web Developer & UI/UX Designer",
    template: "%s | Varun Lambole"
  },
  description: "Portfolio of Varun Lambole - Full Stack Web Developer specializing in the MERN stack, crafting responsive and intuitive web experiences.",
  generator: "Next.js",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  // SEO enhancements
  keywords: ["Web Developer", "MERN Stack", "Full Stack Developer", "Portfolio", "Varun Lambole", "React", "Node.js", "UI/UX Designer", "MongoDB", "Express"],
  authors: [{ name: "Varun Lambole" }],
  creator: "Varun Lambole",
  openGraph: {
    title: "Varun Lambole | Web Developer & UI/UX Designer",
    description: "Portfolio of Varun Lambole - Full Stack Web Developer specializing in the MERN stack, crafting responsive and intuitive web experiences.",
    type: "website",
    locale: "en_US",
    siteName: "Varun Lambole Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Varun Lambole | Web Developer",
    description: "Portfolio of Varun Lambole - Full Stack MERN Developer & UI/UX Designer",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: 'your-verification-code',
  },
}

/**
 * Root Layout
 * 
 * Note: ProjectProvider has been removed as all data is now fetched
 * at build time via ISR in individual page components.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${_inter.variable} ${_geistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <Analytics />
          <SpeedInsights />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
