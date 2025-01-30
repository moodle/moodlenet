/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { fileMeta } from '@moodle/lib-domain-fs'
import { any_, dmesg_, map } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { JsonRecord } from 'fp-ts/Json'
import { asset, externalAsset, maybeAsset } from '../../modules/storage'
import { CONDITIONS_NOT_MET, NOT_FOUND } from '../lib/types'

export declare const model_traits_sym: unique symbol
export type TraitsOps = map<ModelOpDef>
export type ModelTypeTraits = { shape: unknown; ops: TraitsOps; data: JsonRecord }
export type ModelType<traits extends ModelTypeTraits> = traits['shape'] & { [model_traits_sym]: traits }
type modelOpType = 'sync' | 'async' | 'query'
export type ModelOpDef = [type: modelOpType, message: any_, outcome: any_]
// FIX: ModelOpDef=> ModelTypeOpDef

export type IdSpaceMap<
  space_shape,
  filters extends map = map,
  space_ops extends TraitsOps = TraitsOps,
  ops extends TraitsOps = TraitsOps,
> =
  ModelSpace<space_shape, space_ops> extends infer idSpace
    ? ModelType<{
        ops: ops & {
          subset: [
            'query',
            {
              filters?: filters & { ids?: string[] }
              limit?: number
              cursor?: [cursor: string, dir?: 'after' | 'before']
            },
            { items: { id: string; data: SpaceData<space_shape>; cursor: string }[] },
          ]
        }
        shape: map<idSpace>
        data: map<SpaceData<space_shape>>
      }>
    : unknown

export type ModelSpace<shape, ops extends TraitsOps = TraitsOps> = ModelType<{
  shape: shape
  ops: ops & {
    getSpaceData: ['query', void, Either<NOT_FOUND, SpaceData<shape>>]
    purge: ['async', void, Either<NOT_FOUND, 'done'>]
    exists: ['query', void, { exists: boolean }]
  }
  data: SpaceData<shape>
}>

export type SpaceData<shape> = {
  [k in keyof shape]: shape[k] extends ModelType<infer traits> ? traits['data'] : SpaceData<shape[k]>
}

export type EntityData<
  access extends 'r' | 'w',
  data extends JsonRecord,
  opts extends { conditions?: map } = map,
  ops extends TraitsOps = TraitsOps,
> = ModelType<{
  data: data
  ops: ops & {
    get: ['query', void | { conditions?: opts['conditions'] }, Either<dmesg_<NOT_FOUND | CONDITIONS_NOT_MET>, data>]
  } & (access extends 'w'
      ? {
          replace: [
            'sync',
            { newData: data; conditions?: opts['conditions'] },
            Either<dmesg_<NOT_FOUND | CONDITIONS_NOT_MET>, 'done'>,
          ]
        }
      : unknown)
  shape: unknown
}>

export type StaticData<access extends 'r' | 'w', data extends JsonRecord, ops extends TraitsOps = TraitsOps> = ModelType<{
  data: data
  ops: ops & { get: ['query', void, data] } & (access extends 'w' ? { replace: ['sync', { newData: data }, void] } : unknown)
  shape: unknown
}>

export type Asset<opts extends { optional: boolean }> = ModelType<{
  shape: { file: FsFile<{ optional: true }> }
  data: opts['optional'] extends true ? maybeAsset : asset
  ops: {
    fromTempFile: ['async', { tempId: string }, Either<NOT_FOUND, { fileMeta: fileMeta }>]
    fromUrl: ['async', { externalAsset: externalAsset }, Either<NOT_FOUND, void>]
  } & (opts['optional'] extends false ? unknown : { remove: ['async', void, void] })
}>

export type FsFile<opts extends { optional: boolean; image?: boolean }> = ModelType<{
  shape: unknown
  data: { fileMeta: fileMeta | opts['optional'] extends false ? never : null }
  ops: opts['optional'] extends false ? never : { remove: ['async', void, void] }
}>

export type Endpoint<modelOpDef extends ModelOpDef> = ModelType<{ ops: { do: modelOpDef }; shape: unknown; data: never }>
