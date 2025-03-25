import { read } from './read.endpoint'

declare module '..' {
  interface Scope {
    siteInfo: siteInfo
  }
}

export type siteInfo = moo.persona.usecase<{
  read: read
}>
export const siteInfo: moo.gate.provider.usecase<siteInfo> = {
  read,
}
