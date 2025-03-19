import { siteInfo } from './siteInfo.usecase/siteInfo.usecase.core'
import type { viewPublicContent as viewPublicContent_def } from './viewPublicContent.scope'
export const viewPublicContent: moo.def.core.scope<viewPublicContent_def> = {
  siteInfo: siteInfo,
}
