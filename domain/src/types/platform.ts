import { d_u, map } from '@moodle/lib-types'

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
