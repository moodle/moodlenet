import type { PkgExposeDef, RpcFile } from '@moodlenet/core'
import type { ResourceFormRpc, ResourceRpc } from './types.mjs'
export type ResourceExposeType = PkgExposeDef<{
  rpc: {
    // WEBAPP specific
    'webapp/set-is-published/:_key'(
      body: { publish: boolean },
      params: { _key: string },
    ): Promise<void>
    'webapp/get/:_key'(body: null, params: { _key: string }): Promise<ResourceRpc | undefined>
    'webapp/edit/:_key'(body: { values: ResourceFormRpc }, params: { _key: string }): Promise<void>
    'webapp/create'(): Promise<{ _key: string }>
    'webapp/delete/:_key'(body: null, params: { _key: string }): Promise<void>
    'webapp/upload-image/:_key'(
      body: { file: [RpcFile | undefined | null] },
      params: { _key: string },
    ): Promise<string | null>
    'webapp/upload-content/:_key'(
      body: { content: [RpcFile | string | null | undefined] },
      params: { _key: string },
    ): Promise<string | null>
    // OTHER
    'dl/ed-resource/:_key/:filename'(
      body: null,
      params: { _key: string; filename: string },
    ): Promise<RpcFile>
    'basic/v1/create'(body: {
      name: string
      description: string
      resource: string | [RpcFile]
    }): Promise<{
      _key: string
      name: string
      description: string
      url: string
      homepage: string
    }>
  }
}>
