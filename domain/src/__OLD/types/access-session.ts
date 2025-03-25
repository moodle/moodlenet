import { d_u, map, signed_token } from '@moodle/lib-types'
import { moodleApp } from '../modules/env'

type primarySessionId = string
export type primarySession = {
  id: primarySessionId
  domain: string
  protocol: d_u<protocols, 'type'>
  app: { name: moodleApp; version: string }
  // FUTURE: make it `modTokens: { [app_name:string]?: string | null  }`
  token: signed_token | null
  platforms: {
    server: platform
    client: platform
  }
}

type protocols = {
  http: {
    secure: boolean
    mode?: string
    url?: string
    // clientIp?: string // https://github.com/vercel/next.js/pull/68379
    ua: {
      name: string
      isBot?: boolean
    }
  }
  other: map
}
export type platform = d_u<
  {
    browser: browserPlatform
    nodeJs: NodeJsPlatform
    other: unknown
  },
  'type'
>

export type browserPlatform = {
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
  // geo?: { // https://github.com/vercel/next.js/pull/68379
  //   city?: string
  //   country?: string
  //   region?: string
  // }
}

export interface NodeJsPlatform {
  version: string
  //env?: map<string | undefined, string>
}
