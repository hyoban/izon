import "../styles.css"

export const RootLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div id="__waku">
      <meta property="description" content="An internet website!" />
      <link rel="icon" type="image/png" href="/images/favicon.png" />
      <main className="min-h-svh">{children}</main>
    </div>
  )
}
