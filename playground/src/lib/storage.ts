import { createStorage } from "unstorage"
import cloudflareKVHTTPDriver from "unstorage/drivers/cloudflare-kv-http"

// import redisDriver from "unstorage/drivers/redis"

// export const kv = createStorage({
//   driver: redisDriver({
//     host: process.env.REDIS_HOST,
//     port: Number(process.env.REDIS_PORT),
//     password: process.env.REDIS_PASSWORD,
//   }),
// })

export const kv = createStorage({
  driver: cloudflareKVHTTPDriver({
    accountId: process.env.CF_ACCOUNT_ID!,
    namespaceId: process.env.CF_NAMESPACE_ID!,
    apiToken: process.env.CF_API_TOKEN!,
  }),
})
