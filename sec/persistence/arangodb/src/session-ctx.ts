import { AsyncLocalStorage } from 'async_hooks'
import { db_struct_0_1 } from './dbStructure/0_1'

export interface SessionCtx {
  db_struct_0_1: db_struct_0_1
}

export const SessionCtx = new AsyncLocalStorage<SessionCtx>()
