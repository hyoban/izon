import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    CF_API_TOKEN: z.string().min(1),
    CF_ACCOUNT_ID: z.string().min(1),
    CF_NAMESPACE_ID: z.string().min(1),
    GITHUB_TOKEN: z.string().min(1),
  },
  client: {},
  experimental__runtimeEnv: {},
})
