import type { PkgExposeDef, RpcFile } from '@moodlenet/core'
import type {
  EditResourceFormRpc,
  EditResourceRespRpc,
  ResourceRpc,
  ValidationsConfig,
} from '@moodlenet/ed-resource/common'
export type WebappConfigsRpc = { validations: ValidationsConfig }
export type ResourceExposeType = PkgExposeDef<{
  rpc: {
    'ed-resource/webapp/get-configs'(): Promise<WebappConfigsRpc>
    'ed-resource/webapp/set-is-published/:_key'(
      body: { publish: boolean },
      params: { _key: string },
    ): Promise<{ done: boolean }>
    'ed-resource/webapp/get/:_key'(
      body: null,
      params: { _key: string },
    ): Promise<ResourceRpc | null>
    'ed-resource/webapp/edit/:_key'(
      body: { values: EditResourceFormRpc },
      params: { _key: string },
    ): Promise<EditResourceRespRpc>
    'ed-resource/webapp/trash/:_key'(body: null, params: { _key: string }): Promise<void>
    // 'ed-resource/webapp/set-image/:_key'(
    //   body: { file: [RpcFile | undefined | null] },
    //   params: { _key: string },
    // ): Promise<string | null>
    'ed-resource/webapp/create'(body: { content: [RpcFile | string] }): Promise<{ _key: string }>
  }
}>
