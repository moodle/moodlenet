import { Config } from 'arangojs/connection'
import { mkdirSync } from 'fs'
import { join } from 'path'
import '../../../../../../../env'

export const ARANGO_URL = process.env.ARANGO_URL
export const DB_NAME = process.env.DB_NAME
export const cfg: Config = {
  url: ARANGO_URL,
  databaseName: DB_NAME,
}
export const SUBJECTS_AMOUNT = Number(process.env.SUBJECTS_AMOUNT) || 30
export const USERS_AMOUNT = Number(process.env.USERS_AMOUNT) || 1000

export const PARALLEL_MONKEYS = Number(process.env.PARALLEL_MONKEYS) || 100
export const MONKEYS_WAIT = Number(process.env.MONKEYS_WAIT) || 10

export const GEN_DIR = process.env.GEN_DIR || join(__dirname, '_gen')

try {
  mkdirSync(GEN_DIR)
} catch {}
