import type { PkgExposeDef, RpcFile } from '@moodlenet/core'
import type { CollectionFormRpc, CollectionRpc } from './types.mjs'

export type CollectionExposeType = PkgExposeDef<{
  rpc: {
    'webapp/get-mine'(): Promise<{
      collections: Omit<CollectionRpc, 'contributor'>[]
      contributor: CollectionRpc['contributor']
    }>
    'webapp/set-is-published/:_key'(
      body: { publish: boolean },
      params: { _key: string },
    ): Promise<void>
    'webapp/content/:collectionKey/:action/:resourceKey'(
      body: null,
      params: { collectionKey: string; resourceKey: string; action: 'remove' | 'add' },
    ): Promise<void>
    'webapp/my-collections/:containingResourceKey'(
      body: null,
      params: { containingResourceKey: string },
    ): Promise<{ collectionKey: string; collectionName: string; hasResource: boolean }[]>
    'webapp/get/:_key'(body: null, params: { _key: string }): Promise<CollectionRpc | undefined>
    'webapp/edit/:_key'(
      body: { values: CollectionFormRpc },
      params: { _key: string },
    ): Promise<void>
    'webapp/create'(): Promise<{ _key: string }>
    'webapp/delete/:_key'(body: null, params: { _key: string }): Promise<void>
    'webapp/upload-image/:_key'(
      body: { file: [RpcFile | undefined | null] },
      params: { _key: string },
    ): Promise<string | null>
  }
}>
