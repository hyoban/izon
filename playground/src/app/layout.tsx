import "./globals.css"

import { AppearanceSwitch } from "@/components/appearance-switch"
import { Provider } from "jotai"

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
            <div className="h-full p-10 flex flex-col gap-8 items-center max-w-xl mx-auto">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Izon
              </h1>
              <main className="flex-1">{children}</main>
              <footer className="flex gap-4">
                <AppearanceSwitch />
                <a
                  href="http://github.com/hyoban/izon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="i-lucide-github"
                />
              </footer>
            </div>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
