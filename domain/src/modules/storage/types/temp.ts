import { date_time_string, mimetype, ok_ko } from '@moodle/lib-types'
import { userAccountId } from '../../user-account'

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

export type usingTempFile = {
  uploaded_blob_meta: uploaded_blob_meta
  path: string
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
