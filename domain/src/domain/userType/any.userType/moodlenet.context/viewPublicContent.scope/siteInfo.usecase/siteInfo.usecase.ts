import { read } from './read.endpoint'

export interface SiteInfo {
  read: read
}

export type siteInfo = moo.def.userType.usecase<moo<SiteInfo>>
export const siteInfo: moo.def.gate.provider.usecase<siteInfo> = {
  read,
}
