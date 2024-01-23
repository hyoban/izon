import "server-only"

import { createStorage } from "unstorage"
import cloudflareKVHTTPDriver from "unstorage/drivers/cloudflare-kv-http"

const accountId = process.env["CF_ACCOUNT_ID"]
const namespaceId = process.env["CF_NAMESPACE_ID"]
const apiToken = process.env["CF_API_TOKEN"]

if (!accountId || !namespaceId || !apiToken) {
  throw new Error("Missing Cloudflare KV credentials")
}

export const kv = createStorage({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  driver: cloudflareKVHTTPDriver({
    accountId,
    namespaceId,
    apiToken,
  }),
})
