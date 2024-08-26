import { ctrl, priAccess } from './sdk'
import { domain, mod_id } from './types'

export type sessionAccess<_domain extends domain> = (
  _: PrimarySession,
) => Promise<priAccess<_domain>>

export interface PrimarySession {
  mod: mod_id
  protocol: string
  authToken: string
  domain: string
}

export type accessCtrl<_domain extends domain> = (_: PrimarySession) => Promise<ctrl<_domain>>
