import { d_u } from '@moodle/lib/types'
import { ctrl, priAccess } from './sdk'
import { mod_id } from './types'

export type sessionAccess = (_: PrimarySession) => Promise<priAccess>
export type accessCtrl = (_: PrimarySession) => Promise<ctrl>

export interface PrimarySession {
  mod: mod_id
  authToken: string | null | undefined
  host: string
  protoMeta: d_u<ProtocolData, 'proto'>
}

interface ProtocolData {
  http: {
    userAgent: UserAgent
  }
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
