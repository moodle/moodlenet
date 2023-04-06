import { PkgExposeDef, RpcFile } from '@moodlenet/core'
import { ResourceFormRpc, ResourceRpc } from './types.mjs'
export type ResourceExposeType = PkgExposeDef<{
  rpc: {
    'webapp/set-is-published/:_key'(
      body: { publish: boolean },
      params: { _key: string },
    ): Promise<void>
    'webapp/get/:_key'(body: null, params: { _key: string }): Promise<ResourceRpc | undefined>
    'webapp/edit/:_key'(body: { values: ResourceFormRpc }, params: { _key: string }): Promise<void>
    'webapp/create'(): Promise<{ _key: string }>
    'webapp/delete/:_key'(body: null, params: { _key: string }): Promise<void>
    'webapp/upload-image/:_key'(
      body: { file: [RpcFile] },
      params: { _key: string },
    ): Promise<string>
    'webapp/upload-content/:_key'(
      body: { content: [RpcFile | string] },
      params: { _key: string },
    ): Promise<string>
    'dl/resource/:_key/:filename'(
      body: null,
      params: { _key: string; filename: string },
    ): Promise<RpcFile>
  }
}>
