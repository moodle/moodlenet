import { d_u, map } from '@moodle/lib/types'
import { domain_ctrl, priAccess } from './sdk'
import { mod_id } from './types'

export type sessionAccess<_priAccess extends priAccess> = (_: PrimarySession) => Promise<_priAccess>
export type accessCtrl<_ctrl extends domain_ctrl> = (_: PrimarySession) => Promise<_ctrl>

export interface PrimarySession {
  mod: mod_id
  authToken: string | null | undefined
  host: string
  meta: d_u<ProtocolData, 'proto'>
}

interface ProtocolData {
  http: {
    ua: UserAgent
    geo?: {
      city?: string
      country?: string
      region?: string
    }
    ip?: string
    url?: string
  }
  other: map
}
interface UserAgent {
  isBot: boolean
  ua: string
  browser: {
    name?: string
    version?: string
  }
  device: {
    model?: string
    type?: string
    vendor?: string
  }
  engine: {
    name?: string
    version?: string
  }
  os: {
    name?: string
    version?: string
  }
  cpu: {
    architecture?: string
  }
}
