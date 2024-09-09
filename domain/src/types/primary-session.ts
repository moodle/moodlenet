import { d_u, map } from '@moodle/lib-types'
import { platform } from './platform'
import { mod_id } from './mod'

export interface ApplicationPrimarySession {
  domain: {
    host: string
  }
  connection: d_u<Protocols, 'proto'>

  app: { name: string; pkg: string; version: string }

  session: {
    // FIXME: ? make it `modTokens: { [mod_name in keyof Modules]?: string | null  }`
    authToken: string | null
  }
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

export type PrimarySession = d_u<
  {
    app: ApplicationPrimarySession
    system: SystemPrimarySession
  },
  'type'
>

export interface SystemPrimarySession {
  session: {
    mod_id: mod_id
  }
}
