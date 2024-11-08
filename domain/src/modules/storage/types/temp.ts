import { d_u__d, date_time_string, mimetype, ok_ko } from '@moodle/lib-types'
import { userAccountId } from '../../user-account'
import { asset } from './asset'

export * from './primary-schemas'

export type fileHashes = {
  sha256: string
  // ssdeep: string
}

export type uploaded_blob_meta = {
  name: string
  size: number
  mimetype: mimetype
  hash: fileHashes
  uploaded: {
    date: date_time_string
    byUserAccountId: userAccountId
    primarySessionId: string
  }
  original: {
    name: string
    size?: number
    hash?: fileHashes
  }
}

type usingTempFile = {
   uploaded_blob_meta: uploaded_blob_meta
   asset: d_u__d<asset, 'type', 'local'>
 }

export type useTempFileResult = ok_ko<
  usingTempFile,
  {
    tempNotFound: unknown
    move: {
      error: string
    }
    invalidFile: unknown
  }
>
