import "./globals.css"

import { AppearanceSwitch } from "@/components/appearance-switch"
import { GitHubRepositorySelector } from "@/components/github-repository-selector"
import { Analytics } from "@vercel/analytics/react"
import { Provider } from "jotai"
import Link from "next/link"

import { ThemeProvider } from "./theme-provider"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Izon",
  description: "Find a GitHub repository's dependents.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full bg-background overflow-auto">
        <ThemeProvider>
          <Provider>
            <div className="h-full p-4 sm:p-8 flex flex-col gap-6 items-center max-w-xl xl:max-w-2xl mx-auto">
              <div className="flex gap-4 items-center">
                <Link href="/">
                  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    Izon
                  </h1>
                </Link>
                <AppearanceSwitch />
                <a
                  href="http://github.com/hyoban/izon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="i-lucide-github size-6"
                />
              </div>
              <GitHubRepositorySelector />
              <main className="flex-1">{children}</main>
            </div>
          </Provider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
