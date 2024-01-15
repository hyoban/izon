import { createStorage } from "unstorage"
import redisDriver from "unstorage/drivers/redis"

export const kv = createStorage({
  driver: redisDriver({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  }),
})
