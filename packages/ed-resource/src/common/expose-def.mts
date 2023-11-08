import type { PkgExposeDef, RpcFile } from '@moodlenet/core'
import type {
  EditResourceFormRpc,
  EditResourceRespRpc,
  ResourceRpc,
  ResourceSearchResultRpc,
  SortTypeRpc,
} from './types.mjs'
import type { ValidationsConfig } from './validationSchema.mjs'
export type WebappConfigsRpc = { validations: ValidationsConfig }
export type ResourceExposeType = PkgExposeDef<{
  rpc: {
    'webapp/get-configs'(): Promise<WebappConfigsRpc>
    'webapp/set-is-published/:_key'(
      body: { publish: boolean },
      params: { _key: string },
    ): Promise<{ done: boolean }>
    'webapp/get/:_key'(body: null, params: { _key: string }): Promise<ResourceRpc | null>
    'webapp/:action(cancel|start)/meta-autofill/:_key'(
      body: null,
      params: { _key: string; action: 'cancel' | 'start' },
    ): Promise<{ done: boolean }>
    'webapp/edit/:_key'(
      body: { values: Partial<EditResourceFormRpc> },
      params: { _key: string },
    ): Promise<EditResourceRespRpc | null>
    'webapp/trash/:_key'(body: null, params: { _key: string }): Promise<void>
    'webapp/create'(body: { content: [RpcFile | string] }): Promise<{ resourceKey: string } | null>
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
