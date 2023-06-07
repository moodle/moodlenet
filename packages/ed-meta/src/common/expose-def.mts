import type { PkgExposeDef } from '@moodlenet/core'
import type { PublishedMeta } from './types.mjs'
export type EdMetaExposeType = PkgExposeDef<{
  rpc: {
    'webapp/get-all-published-meta'(): Promise<PublishedMeta>
  }
}>
