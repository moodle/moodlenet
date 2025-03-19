import { siteInfo } from './siteInfo.usecase/siteInfo.usecase'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ViewPublicContent {
  siteInfo: siteInfo
}

export type viewPublicContent = moo.def.userType.scope<moo<ViewPublicContent>>
export const viewPublicContent: moo.def.gate.provider.scope<viewPublicContent> = {
  siteInfo: siteInfo,
}
