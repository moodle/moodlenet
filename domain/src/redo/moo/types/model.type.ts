/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { fileMeta } from '@moodle/lib-domain-fs'
import type { any_, dmesg_, map, serializable_object } from '@moodle/lib-types'
import type { Either } from 'fp-ts/Either'
import type { Option } from 'fp-ts/Option'
import type { CONDITIONS_NOT_MET, NOT_FOUND } from '../lib/constants'

declare const traits_sym: unique symbol

declare global {
  namespace moo {
    namespace model {
      type type<traits extends type.traitsDef = type.traitsDef> = traits['shape'] & { [traits_sym]: traits }

      namespace type {
        type traits_prop = typeof traits_sym

        type ops = map<opDef>
        type traitsDef = { shape: unknown; ops: ops; data: serializable_object }

        type opType = 'sync' | 'async' | 'query'
        type opDef = [type: opType, message: any_, outcome: any_]

        type idSpaceMap<space_shape, filters extends map = map, space_ops extends ops = ops, ops_ extends ops = ops> =
          idSpaceModel<space_shape, space_ops> extends infer spaceModel
            ? type<{
                ops: ops_ & {
                  some: [
                    'query',
                    {
                      filters?: filters & { ids?: string[] }
                      limit?: number
                      cursor?: [cursor: string] //, dir?: 'after' | 'before']
                    },
                    { items: { id: string; data: spaceData<space_shape>; cursor: string }[] },
                  ]
                  one: ['query', { filters?: filters }, Option<{ id: string; data: spaceData<space_shape> }>]
                }
                shape: map<spaceModel>
                data: map<spaceData<space_shape>>
              }>
            : unknown

        // type q = Either<{readonly a:string}, {readonly a:string}>
        // type x = q extends JsonRecord ? 1 : 0   // 0  -_-
        // type y = JsonRecord extends q ? 1 : 0   // 0  -_-

        type idSpaceModel<shape, ops_ extends ops = ops> = type<{
          shape: shape
          ops: ops_ & {
            getData: ['query', void, Either<dmesg_<typeof NOT_FOUND>, spaceData<shape>>]
            purge: ['async', void, Either<dmesg_<typeof NOT_FOUND>, 'done'>]
            exists: ['query', void, { exists: boolean }]
            create: ['async', { spaceData: spaceData<shape> }, void]
          }
          data: spaceData<shape>
        }>

        type idAggregate<data extends serializable_object, ops_ extends ops = ops> = type<{
          shape: unknown
          ops: ops_ & {
            get: ['query', void, Either<dmesg_<typeof NOT_FOUND>, data>]
          }
          data: never
        }>

        type spaceData<shape> = {
          [k in keyof shape]: shape[k] extends type<infer traits> ? traits['data'] : spaceData<shape[k]>
        }

        type entityData<
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
            replace: [
              'sync',
              { newData: data; conditions?: opts['conditions'] },
              Either<dmesg_<typeof NOT_FOUND | typeof CONDITIONS_NOT_MET>, 'done'>,
            ]
          }
          shape: unknown
        }>

        type staticData<data extends serializable_object, ops_ extends ops = ops> = type<{
          data: data
          ops: ops_ & { get: ['query', void, data]; replace: ['sync', { newData: data }, void] }
          shape: unknown
        }>

        // type staticAggregate<data extends serializable_object, ops_ extends ops = ops> = type<{
        //   shape: unknown
        //   ops: ops_ & { get: ['query', void, data] }
        //   data: data
        // }>

        type asset<opts extends { optional: boolean }> = type<{
          shape: { file: fsFile<{ optional: true }> }
          data: opts['optional'] extends true ? content.asset.maybe : content.asset
          ops: {
            fromTempFile: ['async', { tempId: string }, Either<dmesg_<typeof NOT_FOUND>, { fileMeta: fileMeta }>]
            fromUrl: ['async', { externalAsset: content.asset.external }, Either<dmesg_<typeof NOT_FOUND>, void>]
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
