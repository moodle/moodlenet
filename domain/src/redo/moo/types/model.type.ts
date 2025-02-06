/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { fileMeta } from '@moodle/lib-domain-fs'
import type { any_, dmesg_, map, serializable_object } from '@moodle/lib-types'
import type { Either } from 'fp-ts/Either'
import type { Option } from 'fp-ts/Option'
import type { CONDITIONS_NOT_MET, NOT_FOUND } from '../lib/constants'

declare global {
  namespace moo {
    namespace model {
      type type<traits extends type.traitsDef = type.traitsDef> = traits['shape'] & { [k in type.traits_prop]: traits }
      namespace type {
        type traits_prop = '#'

        type ops = map<opDef>
        type traitsDef = { shape: unknown; ops: ops; data: serializable_object }

        type opType = 'sync' | 'async' | 'query'
        type opDef = [type: opType, message: any_, outcome: any_]
        // FIX: ModelOpDef=> TypeModelOpDef

        type idSpaceMap<space_shape, filters extends map = map, space_ops extends ops = ops, ops_ extends ops = ops> =
          modelSpace<space_shape, space_ops> extends infer idSpace
            ? type<{
                ops: ops_ & {
                  some: [
                    'query',
                    {
                      filters?: filters & { ids?: string[] }
                      limit?: number
                      cursor?: [cursor: string, dir?: 'after' | 'before']
                    },
                    { items: { id: string; data: spaceData<space_shape>; cursor: string }[] },
                  ]
                  one: ['query', { filters?: filters }, Option<{ id: string; data: spaceData<space_shape> }>]
                }
                shape: map<idSpace>
                data: map<spaceData<space_shape>>
              }>
            : unknown

        type modelSpace<shape, ops_ extends ops = ops> = type<{
          shape: shape
          ops: ops_ & {
            getSpaceData: ['query', void, Either<typeof NOT_FOUND, spaceData<shape>>]
            purge: ['async', void, Either<typeof NOT_FOUND, 'done'>]
            exists: ['query', void, { exists: boolean }]
            create: ['async', { spaceData: spaceData<shape> }, void]
          }
          data: spaceData<shape>
        }>

        type spaceData<shape> = {
          [k in keyof shape]: shape[k] extends type<infer traits> ? traits['data'] : spaceData<shape[k]>
        }

        type entityData<
          access extends 'r' | 'w',
          data extends serializable_object,
          opts extends { conditions?: map } = map,
          ops_ extends ops = ops,
        > = type<{
          data: data
          ops: ops_ & {
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

        type staticData<access extends 'r' | 'w', data extends serializable_object, ops_ extends ops = ops> = type<{
          data: data
          ops: ops_ & { get: ['query', void, data] } & (access extends 'w'
              ? { replace: ['sync', { newData: data }, void] }
              : unknown)
          shape: unknown
        }>

        type asset<opts extends { optional: boolean }> = type<{
          shape: { file: fsFile<{ optional: true }> }
          data: opts['optional'] extends true ? content.asset.maybe : content.asset
          ops: {
            fromTempFile: ['async', { tempId: string }, Either<typeof NOT_FOUND, { fileMeta: fileMeta }>]
            fromUrl: ['async', { externalAsset: content.asset.external }, Either<typeof NOT_FOUND, void>]
          } & (opts['optional'] extends false ? unknown : { remove: ['async', void, void] })
        }>

        type fsFile<opts extends { optional: boolean; image?: boolean }> = type<{
          shape: unknown
          data: { fileMeta: fileMeta | opts['optional'] extends false ? never : null }
          ops: opts['optional'] extends false ? never : { remove: ['async', void, void] }
        }>

        type endpoint<modelOpDef extends opDef> = type<{ ops: { call: modelOpDef }; shape: unknown; data: never }>
      }
    }
  }
}
