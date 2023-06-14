import type { PkgExposeDef } from '@moodlenet/core'
import type { PublishedMeta, SubjectPageData } from './types.mjs'
export type EdMetaExposeType = PkgExposeDef<{
  rpc: {
    'webapp/get-all-published-meta'(): Promise<PublishedMeta>
    'webapp/subject-page-data/:_key'(
      body: void,
      params: { _key: string },
    ): Promise<SubjectPageData | null>
  }
}>
