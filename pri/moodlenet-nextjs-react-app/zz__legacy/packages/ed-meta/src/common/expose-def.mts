import type { PkgExposeDef } from '@moodlenet/core'
import type { PublishedMeta, SortTypeRpc, SubjectData, SubjectSearchResultRpc } from './types.mjs'
export type EdMetaExposeType = PkgExposeDef<{
  rpc: {
    'webapp/get-all-published-meta'(): Promise<PublishedMeta>
    'webapp/subject-page-data/:_key'(
      body: void,
      params: { _key: string },
    ): Promise<SubjectData | null>
    'webapp/search'(
      body: null,
      params: null,
      query: { sortType?: SortTypeRpc; text?: string; after?: string; limit?: number },
    ): Promise<SubjectSearchResultRpc>
  }
}>
