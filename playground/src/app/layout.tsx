import "./globals.css"

import { AppearanceSwitch } from "@/components/appearance-switch"
import { Provider } from "jotai"

import { ThemeProvider } from "./theme-provider"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Izon",
  description: "Find what projects are using it",
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
            <div className="h-full p-10 flex flex-col gap-8 items-center max-w-lg mx-auto">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Izon
              </h1>
              <main className="flex-1">{children}</main>
              <AppearanceSwitch />
            </div>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
