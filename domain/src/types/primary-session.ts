import { d_u, map } from '@moodle/lib-types'
import { platform } from './platform'
import { mod_id } from './mod'

export type session_token = string

export interface UserPrimarySession {
  domain: {
    host: string
  }
  connection: d_u<Protocols, 'proto'>

  app: { name: string; pkg: string; version: string }

  // FIXME: ? make it `modTokens: { [mod_name in keyof Modules]?: string | null  }`
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

export type primary_session = d_u<
  {
    user: UserPrimarySession
    system: SystemPrimarySession
  },
  'type'
>

export interface SystemPrimarySession {
  session: {
    mod_id: mod_id
  }
}
