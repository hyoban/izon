export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        id="change-theme"
        dangerouslySetInnerHTML={{
          __html: `!(function () {
              var e =
                  window.matchMedia &&
                  window.matchMedia("(prefers-color-scheme: dark)").matches,
                t = localStorage.getItem("use-dark") || '"system"';
              ('"dark"' === t || (e && '"light"' !== t)) &&
                document.documentElement.classList.toggle("dark", !0);
            })();`,
        }}
      ></script>
      {children}
    </>
  )
}
