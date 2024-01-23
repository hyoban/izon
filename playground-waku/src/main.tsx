import { StrictMode } from "react"
import { createRoot, hydrateRoot } from "react-dom/client"
import { Router } from "waku/router/client"

import { ErrorBoundary } from "./components/error-boundary"

const rootElement = (
  <StrictMode>
    <ErrorBoundary fallback={(error) => String(error)}>
      <Router />
    </ErrorBoundary>
  </StrictMode>
)

if (import.meta.env.WAKU_HYDRATE) {
  hydrateRoot(document.body, rootElement)
} else {
  createRoot(document.body).render(rootElement)
}
