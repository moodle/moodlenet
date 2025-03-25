/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { any_ } from '@moodle/lib-types'
import type { Either } from 'fp-ts/Either'
import type { Option } from 'fp-ts/Option'
import type { TEMP_FILE_NOT_FOUND } from '../lib/constants'
import { cursorList, pageOpts } from './content'

declare const op_sym: unique symbol

declare global {
  namespace moo.def.model {
    type op<op_def extends op.def = op.def> = op_def & typeof op_sym

    namespace op {
      type type = 'sync' | 'async' | 'query'
      type def = [type: type, message: any_, outcome: any_] | def_fn
      type def_fn = [type: type, fn: (msg: any_) => Promise<any_>]
      type sym = typeof op_sym
      type fn<op extends def> = op extends def_fn ? op[1] : (msg: op[1]) => Promise<op[2]>
      type msg<op extends def> = op extends def_fn ? Parameters<op[1]>[0] : op[1]
      type res<op extends def> = op extends def_fn ? ReturnType<op[1]> : op[2]

      type set<record, filter /* , order extends string */> = {
        find: set.find<record, filter /* , order */>
        count: set.count<filter>
        del: set.del<record, filter>
        create: set.create<record>
        replace: set.replace<record>
      }
      namespace set {
        type find<record, filter /* , order extends string */> = op<['query', pageOpts<filter /* , order */>, cursorList<record>]>
        type count<filter> = op<['query', { filter: filter; atMost?: number | 1 }, { count: number }]>
        type del<record, filter> = op<['sync', { filter: filter; limit?: number | 1 }, { deleted: record[] }]>
        type create<record> = op<['sync', { record: record }, void]>
        type replace<record> = op<['sync', { record: record }, Option<{ was: record }>]>
      }
      type value<data, opts = never> = {
        get: value.get<data>
        put: value.put<data, opts>
      }
      namespace value {
        type get<data> = op<['query', void, data]>
        type put<data, opts = never> = op<['sync', { newData: data; opts?: opts }, Option<{ was: data }>]>
      }
      type asset<flags = 'optional'> = {
        fromTempFile: asset.fromTempFile
        fromUrl: asset.fromUrl
        remove: asset.remove<flags>
        get: asset.get<flags>
      }
      namespace asset {
        type flags = 'optional' | 'static'
        type fromTempFile = op<['async', { tempId: string }, Either<TEMP_FILE_NOT_FOUND, { fileMeta: def.content.fileMeta }>]>
        type fromUrl = op<['async', { externalAsset: def.content.asset.external }, void]>
        type remove<flags = never> = op<['async', void, flags extends 'optional' ? Option<void> : void]>
        type get<flags = never> = op<['query', void, flags extends 'optional' ? Option<{ fileMeta: def.content.fileMeta }> : { fileMeta: def.content.fileMeta }]>
      }
    }
  }
}
