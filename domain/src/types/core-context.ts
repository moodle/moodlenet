import { Modules } from '../domain'
import { PrimarySession } from './primary-session'

export interface CoreContext {
  mod: Modules
  primarySession: PrimarySession
}
