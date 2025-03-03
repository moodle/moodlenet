/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { fileMeta } from '@moodle/lib-domain-fs'
import type { any_, map, serializable_object } from '@moodle/lib-types'
import type { Either } from 'fp-ts/Either'
import type { Option } from 'fp-ts/Option'
import type { TEMP_FILE_NOT_FOUND } from '../lib/constants'

declare const traits_sym: unique symbol
type traitsFlags = 'static' | 'view'

declare global {
  namespace moo {
    namespace model {
      type type<traits extends type.traitsDef = type.traitsDef> = traits['shape'] & { [traits_sym]: traits }

      namespace type {
        type traits_prop = typeof traits_sym
        type ops = map<opDef>
        type no_ops = map<opDef, never>
        type traitsDef = { shape: unknown; ops: ops; data: serializable_object; flags: traitsFlags }

        type opType = 'sync' | 'async' | 'query'
        type opDef = [type: opType, message: any_, outcome: any_]

        type idSpaceMap<space_shape, filters extends map = map, space_ops extends ops = no_ops, ops_ extends ops = no_ops> =
          idSpaceModel<space_shape, space_ops> extends infer spaceModel
            ? type<{
                ops: ops_ & {
                  // emptySpace: ['query', void, sSpaceData<space_shape>]
                  some: [
                    'query',
                    {
                      filters?: filters & { ids?: string[] }
                      limit?: number
                      cursor?: [cursor: string] //, dir?: 'after' | 'before']
                    },
                    { items: { id: string; data: xSpaceData<space_shape>; cursor: string }[] },
                  ]
                  one: ['query', { filters?: filters }, Option<{ id: string; data: xSpaceData<space_shape> }>]
                  // createMany: ['sync', { spaces: { id: string; data: sSpaceData<space_shape> }[] }, void]
                }
                shape: map<spaceModel>
                // data: map<null | xSpaceData<space_shape>>
                data: map<xSpaceData<space_shape>>
                flags: never
              }>
            : unknown

        type idSpaceModel<shape, ops_ extends ops = no_ops> = type<{
          shape: shape
          ops: ops_ & {
            getData: ['query', void, Option<xSpaceData<shape>>]
            purge: ['sync', void, Option<'done'>]
            exists: ['query', void, { exists: boolean }]
            create: ['sync', { spaceData: sSpaceData<shape> }, void]
          }
          data: xSpaceData<shape>
          flags: never
        }>

        // type staticAggregate<data extends serializable_object, ops_ extends ops = no_ops> = type<{
        //   shape: unknown
        //   ops: ops_ & { get: ['query', void, data] }
        //   data: data
        // }>

        type xSpaceData<shape> = spaceData<shape, false>
        type sSpaceData<shape> = spaceData<shape, true>
        type spaceData<shape, strict extends boolean = true> = {
          [k in keyof shape as strict extends false ? k : shape[k] extends type<infer traits> ? ('view' extends traits['flags'] ? never : k) : k]: shape[k] extends type<
            infer traits
          >
            ? traits['data']
            : spaceData<shape[k], strict>
        }

        type atom<flags extends traitsFlags, data extends serializable_object, ops_ extends ops = no_ops, opts = never> = type<{
          data: data
          ops: ops_ & {
            get: ['query', void, 'static' extends flags ? data : Option<data>]
          } & ('view' extends flags
              ? unknown
              : {
                  put: ['sync', { newData: data; opts?: opts }, 'static' extends flags ? 'done' : Option<{ was: data }>]
                })
          shape: unknown
          flags: flags
        }>

        type asset<flags extends traitsFlags | 'optional'> = type<{
          shape: unknown
          data: 'optional' extends flags ? content.asset.optional : content.asset
          ops: {
            fromTempFile: ['async', { tempId: string }, Either<TEMP_FILE_NOT_FOUND, 'static' extends flags ? { fileMeta: fileMeta } : Option<{ fileMeta: fileMeta }>>]
            fromUrl: ['async', { externalAsset: content.asset.external }, 'static' extends flags ? void : Option<void>]
          } & ('optional' extends flags ? { remove: ['async', void, 'static' extends flags ? void : Option<void>] } : unknown)
          flags: Exclude<flags, 'optional'>
        }>

        type endpoint<modelOpDef extends opDef> = type<{ ops: { call: modelOpDef }; shape: unknown; data: never; flags: never }>
      }
    }
  }
}
