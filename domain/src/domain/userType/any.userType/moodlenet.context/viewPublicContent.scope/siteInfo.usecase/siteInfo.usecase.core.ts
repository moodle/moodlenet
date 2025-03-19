import { read } from './read.core'
import type { siteInfo as siteInfo_def } from './siteInfo.usecase'
export const siteInfo: moo.def.core.usecase<siteInfo_def> = {
  read,
}
