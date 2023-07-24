import type { PkgExposeDef } from '@moodlenet/core'
import type { LmsWebUserConfig, SiteTarget } from './types.mjs'

export type MoodleLMSExposeType = PkgExposeDef<{
  rpc: {
    'webapp/get-my-config'(): Promise<LmsWebUserConfig>
    'webapp/add-my-lms-site-target'(body: { siteTarget: SiteTarget }): Promise<LmsWebUserConfig>
  }
}>
