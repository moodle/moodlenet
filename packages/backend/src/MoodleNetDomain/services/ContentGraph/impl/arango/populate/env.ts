import { Config } from 'arangojs/connection'
import { mkdirSync } from 'fs'
import { join } from 'path'
import '../../../../../../../env'

export const ARANGO_HOST = process.env.ARANGO_HOST
export const DB_NAME = process.env.DB_NAME
if (!(DB_NAME && ARANGO_HOST)) {
  console.error({ ARANGO_HOST, DB_NAME })
  throw 'missing DB_NAME | ARANGO_HOST env'
}
export const databaseName = DB_NAME
export const cfg: Config = {
  url: ARANGO_HOST,
}
export const SUBJECTS_AMOUNT = Number(process.env.SUBJECTS_AMOUNT) || 30
export const USERS_AMOUNT = Number(process.env.USERS_AMOUNT) || 100

export const PARALLEL_MONKEYS = Number(process.env.PARALLEL_MONKEYS) || 100
export const MONKEYS_WAIT = Number(process.env.MONKEYS_WAIT) || 10

export const GEN_DIR = process.env.GEN_DIR || join(__dirname, '_gen')

try {
  mkdirSync(GEN_DIR)
} catch {}
