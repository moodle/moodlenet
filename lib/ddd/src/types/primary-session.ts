import { d_u, map, signed_token } from '@moodle/lib-types'
import { mod_id } from './mod'

export type session_token = signed_token

export interface UserPrimarySession extends PriSessionBase {
  connection: d_u<Connections, 'proto'>

  app: { name: string; pkg: string; version: string }

  // NOTE: ? make it `modTokens: { [app_name:string]?: string | null  }`
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

export type platform = d_u<
  {
    browser: BrowserPlatform
    nodeJs: NodeJsPlatform
    other: unknown
  },
  'type'
>

export interface BrowserPlatform {
  name?: string
  version?: string
  device?: {
    model?: string
    type?: string
    vendor?: string
  }
  engine?: {
    name?: string
    version?: string
  }
  os?: {
    name?: string
    version?: string
  }
  cpu?: {
    architecture?: string
  }
  geo?: {
    city?: string
    country?: string
    region?: string
  }
}

export interface NodeJsPlatform {
  version: string
  env?: map<string | undefined, string>
}
