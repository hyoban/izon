import "./globals.css"

import { AppearanceSwitch } from "@/components/appearance-switch"
import { Provider } from "jotai"
import Link from "next/link"

import { ThemeProvider } from "./theme-provider"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Izon",
  description: "Find a github repository's dependents.",
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
            <div className="h-full p-4 sm:p-8 flex flex-col gap-6 items-center max-w-xl mx-auto">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                <Link href="/">Izon</Link>
              </h1>
              <main className="flex-1">{children}</main>
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-4">
                  <AppearanceSwitch />
                  <a
                    href="http://github.com/hyoban/izon"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="i-lucide-github"
                  />
                </div>
                <footer className="opacity-50 text-sm text-center">
                  As we can not fetch a github repository's dependents at once,
                  so the Dependents Table may be incomplete.
                </footer>
              </div>
            </div>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
