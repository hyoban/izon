import { env } from "@/env.mjs"
import { createStorage } from "unstorage"
import cloudflareKVHTTPDriver from "unstorage/drivers/cloudflare-kv-http"

export const kv = createStorage({
  driver: cloudflareKVHTTPDriver({
    accountId: env.CF_ACCOUNT_ID,
    namespaceId: env.CF_NAMESPACE_ID,
    apiToken: env.CF_API_TOKEN,
  }),
})
