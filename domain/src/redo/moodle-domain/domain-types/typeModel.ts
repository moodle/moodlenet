/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { fileMeta } from '@moodle/lib-domain-fs'
import type { any_, dmesg_, map } from '@moodle/lib-types'
import type { Either } from 'fp-ts/Either'
import type { JsonRecord } from 'fp-ts/Json'
import type { asset, externalAsset, maybeAsset } from '../../../modules/storage'
import type { CONDITIONS_NOT_MET, NOT_FOUND } from '../../lib/constants'
import type { Option } from 'fp-ts/Option'

declare module 'moodle-domain' {
  type TypeModel<traits extends TypeModelTraits> = traits['shape'] & { [model_traits_sym]: traits }

  const model_traits_sym: unique symbol
  type TraitsOps = map<ModelOpDef>
  type TypeModelTraits = { shape: unknown; ops: TraitsOps; data: JsonRecord }

  type modelOpType = 'sync' | 'async' | 'query'
  type ModelOpDef = [type: modelOpType, message: any_, outcome: any_]
  // FIX: ModelOpDef=> TypeModelOpDef

  type IdSpaceMap<
    space_shape,
    filters extends map = map,
    space_ops extends TraitsOps = TraitsOps,
    ops extends TraitsOps = TraitsOps,
  > =
    ModelSpace<space_shape, space_ops> extends infer idSpace
      ? TypeModel<{
          ops: ops & {
            some: [
              'query',
              {
                filters?: filters & { ids?: string[] }
                limit?: number
                cursor?: [cursor: string, dir?: 'after' | 'before']
              },
              { items: { id: string; data: SpaceData<space_shape>; cursor: string }[] },
            ]
            one: ['query', { filters?: filters }, Option<{ id: string; data: SpaceData<space_shape> }>]
          }
          shape: map<idSpace>
          data: map<SpaceData<space_shape>>
        }>
      : unknown

  type ModelSpace<shape, ops extends TraitsOps = TraitsOps> = TypeModel<{
    shape: shape
    ops: ops & {
      getSpaceData: ['query', void, Either<typeof NOT_FOUND, SpaceData<shape>>]
      purge: ['async', void, Either<typeof NOT_FOUND, 'done'>]
      exists: ['query', void, { exists: boolean }]
    }
    data: SpaceData<shape>
  }>

  type SpaceData<shape> = {
    [k in keyof shape]: shape[k] extends TypeModel<infer traits> ? traits['data'] : SpaceData<shape[k]>
  }

  type EntityData<
    access extends 'r' | 'w',
    data extends JsonRecord,
    opts extends { conditions?: map } = map,
    ops extends TraitsOps = TraitsOps,
  > = TypeModel<{
    data: data
    ops: ops & {
      get: [
        'query',
        void | { conditions?: opts['conditions'] },
        Either<dmesg_<typeof NOT_FOUND | typeof CONDITIONS_NOT_MET>, data>,
      ]
    } & (access extends 'w'
        ? {
            replace: [
              'sync',
              { newData: data; conditions?: opts['conditions'] },
              Either<dmesg_<typeof NOT_FOUND | typeof CONDITIONS_NOT_MET>, 'done'>,
            ]
          }
        : unknown)
    shape: unknown
  }>

  type StaticData<access extends 'r' | 'w', data extends JsonRecord, ops extends TraitsOps = TraitsOps> = TypeModel<{
    data: data
    ops: ops & { get: ['query', void, data] } & (access extends 'w'
        ? { replace: ['sync', { newData: data }, void] }
        : unknown)
    shape: unknown
  }>

  type Asset<opts extends { optional: boolean }> = TypeModel<{
    shape: { file: FsFile<{ optional: true }> }
    data: opts['optional'] extends true ? maybeAsset : asset
    ops: {
      fromTempFile: ['async', { tempId: string }, Either<typeof NOT_FOUND, { fileMeta: fileMeta }>]
      fromUrl: ['async', { externalAsset: externalAsset }, Either<typeof NOT_FOUND, void>]
    } & (opts['optional'] extends false ? unknown : { remove: ['async', void, void] })
  }>

  type FsFile<opts extends { optional: boolean; image?: boolean }> = TypeModel<{
    shape: unknown
    data: { fileMeta: fileMeta | opts['optional'] extends false ? never : null }
    ops: opts['optional'] extends false ? never : { remove: ['async', void, void] }
  }>

  type Endpoint<modelOpDef extends ModelOpDef> = TypeModel<{ ops: { do: modelOpDef }; shape: unknown; data: never }>
}
