import Redis, { RedisOptions } from 'ioredis'
import * as Yup from 'yup'

type RedisOptsEnv = Pick<RedisOptions, 'host' | 'port' | 'password' | 'db'>

interface QueueEnv {
  redisOpts: RedisOptsEnv
}

const REDIS_HOST = process.env.QUEUE_REDIS_HOST
const REDIS_DB = process.env.QUEUE_REDIS_DB
const REDIS_PASSWORD = process.env.QUEUE_REDIS_PASSWORD
const REDIS_PORT = process.env.QUEUE_REDIS_PORT

const Validator = Yup.object<QueueEnv>({
  redisOpts: Yup.object<RedisOptsEnv>({
    host: Yup.string().default('localhost'),
    db: Yup.number().default(0),
    password: Yup.string().default(''),
    port: Yup.number().default(6379),
  }).required(),
})

export const env = Validator.validateSync({
  redisOpts: {
    host: REDIS_HOST,
    db: REDIS_DB,
    password: REDIS_PASSWORD,
    port: REDIS_PORT,
  },
})!

export const client = new Redis(env.redisOpts)
