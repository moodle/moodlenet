/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { fileMeta } from '@moodle/lib-domain-fs'
import type { any_, map } from '@moodle/lib-types'
import type { Either } from 'fp-ts/Either'
import type { Option } from 'fp-ts/Option'
import type { TEMP_FILE_NOT_FOUND } from '../lib/constants'
import { cursorList, pageOpts } from './content'

declare const ops_sym: unique symbol

declare global {
  namespace moo {
    namespace model {
      type ops_prop = typeof ops_sym
      type ops<ops_ extends ops.def = ops.def> = { [ops_sym]: ops_ }

      namespace ops {
        type opType = 'sync' | 'async' | 'query'
        type opDef = [type: opType, message: any_, outcome: any_]
        type def = map<opDef>
      }
      namespace type {
        namespace set {
          type query<item, filter, order extends string> = ['query', pageOpts<filter, order>, cursorList<item>]
          type exists<filter> = ['query', filter, { exists: boolean }]
          type del<item, filter> = ['sync', { filter: filter; limit?: number | 1 }, { deleted: item[] }]
          type create<item> = ['sync', { items: item[] }, void]
          type replace<item> = ['sync', { items: item[] }, { were: item[] }]
        }
        namespace atom {
          type get<data> = ['query', void, data]
          type put<data, opts = never> = ['sync', { newData: data; opts?: opts }, { was: data }]
        }
        namespace asset {
          type fromTempFile = ['async', { tempId: string }, Either<TEMP_FILE_NOT_FOUND, { fileMeta: fileMeta }>]
          type fromUrl = ['async', { externalAsset: content.asset.external }, void]
          type remove<static = false> = ['async', void, static extends false ? Option<void> : void]
          type get<static = false> = ['query', void, static extends false ? Option<{ fileMeta: fileMeta }> : { fileMeta: fileMeta }]
        }
      }
    }
  }
}
