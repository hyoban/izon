import { createPages } from "waku"

import { HomePage } from "./templates/home-page"
import { RootLayout } from "./templates/root-layout"

// eslint-disable-next-line @typescript-eslint/require-await
export default createPages(async ({ createPage, createLayout }) => {
  createLayout({
    render: "static",
    path: "/",
    component: RootLayout,
  })

  createPage({
    render: "static",
    path: "/",
    component: HomePage,
  })
})
