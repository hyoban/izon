import "../styles.css"

import { AppearanceSwitch } from "@/components/appearance-switch"
import { Provider } from "jotai"
import { Link } from "waku/router/client"

import { ThemeProvider } from "./theme-provider"

export function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <div id="__waku">
      <title>Izon</title>
      <meta
        property="description"
        content="Find a GitHub repository's dependents."
      />
      <link rel="icon" type="image/png" href="/images/favicon.png" />
      <main className="min-h-svh bg-background overflow-auto">
        <ThemeProvider>
          <Provider>
            <div className="h-full p-4 sm:p-8 flex flex-col gap-4 items-center max-w-xl xl:max-w-2xl mx-auto">
              <div className="flex gap-4 items-center">
                <Link to="/">
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
              {/* <GitHubRepositorySelector /> */}
              <main className="flex-1">{children}</main>
            </div>
          </Provider>
        </ThemeProvider>
      </main>
    </div>
  )
}
