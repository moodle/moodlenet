import { d_u, d_u__d, map, signed_token } from '@moodle/lib-types'
import { domain_endpoint } from './mod'

export type session_token = signed_token

export interface UserAccessSession extends AccessSessionBase {
  id: d_u__d<session_id, 'type', 'primary-session'>
  protocol: d_u<Protocols, 'type'>

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
  id: d_u__d<session_id, 'type', 'background-process' | 'session-sys-call'>
  from: domain_endpoint
}

type session_id = d_u<
  {
    'primary-session': {
      uid: string
    }
    'session-sys-call': {
      primarySessionUid: string
    }
    'background-process': {
      domain: string
    }
  },
  'type'
>

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
