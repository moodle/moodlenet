import { d_u, map, signed_token } from '@moodle/lib-types'
import { mod_id } from './mod'

export type session_token = signed_token

export interface UserAccessSession extends AccessSessionBase {
  protocol: d_u<Protocols, 'type'>

  app: { name: string; pkg: string; version: string }

  // NOTE: ? make it `modTokens: { [app_name:string]?: string | null  }`
  sessionToken: session_token | null
  platforms: {
    local: platform
    remote: platform
  }
}

interface Protocols {
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

export interface SystemAccessSession extends AccessSessionBase {
  mod_id: mod_id
}

export interface AccessSessionBase {
  domain: string
}

export type access_session = d_u<
  {
    user: UserAccessSession
    system: SystemAccessSession
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
