import type { PkgExposeDef } from '@moodlenet/core'
import type { ResourceSearchResultRpc, SortTypeRpc } from './types.mjs'
import type { ValidationsConfig } from './validationSchema.mjs'
export type WebappConfigsRpc = { validations: ValidationsConfig }
export type ResourceExposeType = PkgExposeDef<{
  rpc: {
    // 'webapp/get-configs'(): Promise<WebappConfigsRpc>
    // 'webapp/set-is-published/:_key'(
    //   body: { publish: boolean },
    //   params: { _key: string },
    // ): Promise<boolean | null | undefined>
    // 'webapp/get/:_key'(body: null, params: { _key: string }): Promise<ResourceRpc | null>
    // 'webapp/edit/:_key'(body: { values: ResourceFormRpc }, params: { _key: string }): Promise<void>
    // 'webapp/create'(): Promise<{ _key: string }>
    // 'webapp/delete/:_key'(body: null, params: { _key: string }): Promise<void>
    // 'webapp/upload-image/:_key'(
    //   body: { file: [RpcFile | undefined | null] },
    //   params: { _key: string },
    // ): Promise<string | null>
    // 'webapp/upload-content/:_key'(
    //   body: { content: [RpcFile | string | null | undefined] },
    //   params: { _key: string },
    // ): Promise<string | null>
    'webapp/search'(
      body: undefined,
      params: undefined,
      query: {
        sortType?: SortTypeRpc
        filterSubjects?: string
        filterTypes?: string
        filterLevels?: string
        filterLanguages?: string
        filterLicenses?: string
        text?: string
        after?: string
        limit?: number
      },
    ): Promise<ResourceSearchResultRpc>
    'webapp/get-resources-count-in-subject/:subjectKey'(
      body: null,
      params: { subjectKey: string },
    ): Promise<{ count: number }>
  }
}>
