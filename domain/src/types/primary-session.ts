import { d_u, map } from '@moodle/lib-types'
import { mod_id } from './mod'
import { platform } from './platform'

export type session_token = string

export interface UserPrimarySession extends PriSessionBase {
  connection: d_u<Protocols, 'proto'>

  app: { name: string; pkg: string; version: string }

  // FIXME: ? make it `modTokens: { [app_name:string]?: string | null  }`
  sessionToken: session_token | null
  platforms: {
    local: platform
    remote: platform
  }
}

interface Protocols {
  http: {
    mode?: string
    url?: string
    ip?: string
    ua: {
      name: string
      isBot?: boolean
    }
  }
  other: map
}


export interface SystemPrimarySession extends PriSessionBase {
  mod_id: mod_id
}

export interface PriSessionBase {
  domain: string
}

export type primary_session = d_u<
  {
    user: UserPrimarySession
    system: SystemPrimarySession
  },
  'type'
>
