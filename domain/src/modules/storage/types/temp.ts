import { d_u__d, ok_ko } from '@moodle/lib-types'
import { asset, fileAssetMeta } from './asset'

export * from './primary-schemas'

export type useTempFileResult = ok_ko<
  {
    fileAssetMeta: fileAssetMeta
    asset: d_u__d<asset, 'type', 'stored'>
  },
  {
    tempNotFound: unknown
    move: {
      error: string
    }
    invalidFile: unknown
  }
>
