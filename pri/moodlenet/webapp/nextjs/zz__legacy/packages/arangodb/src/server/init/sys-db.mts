import { Database } from 'arangojs'
import { env } from './env.mjs'

export const sysDB = new Database({ ...env.connectionCfg })
