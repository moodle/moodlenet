import { d_u, map } from '@moodle/lib/types'
import { platform } from './platform'

export interface PrimarySession {
  domain: {
    host: string
  }
  connection: d_u<Protocols, 'proto'>

  app: { name: string; pkg: string; version: string }

  session: {
    // FIXME: make it `modTokens: { [mod_name in keyof Modules]?: string | null | undefined }`
    authToken?: string | null | undefined
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
