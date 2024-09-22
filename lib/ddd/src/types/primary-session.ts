import { d_u, encrypted_token, map } from '@moodle/lib-types'
import { mod_id } from './mod'
import { platform } from './platform'

export type session_token = encrypted_token

export interface UserPrimarySession extends PriSessionBase {
  connection: d_u<Connections, 'proto'>

  app: { name: string; pkg: string; version: string }

  // FIXME: ? make it `modTokens: { [app_name:string]?: string | null  }`
  sessionToken: session_token | null
  platforms: {
    local: platform
    remote: platform
  }
}

interface Connections {
  http: {
    secure: boolean
    mode?: string
    url?: string
    clientIp?: string
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
