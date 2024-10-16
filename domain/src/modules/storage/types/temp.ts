import { d_u__d, date_time_string, mimetype, ok_ko } from '@moodle/lib-types'
import { user_id } from '../../iam'
import { assetRecord } from './asset'

export * from './primary-schemas'

export type fileHashes = {
  sha256: string
  // ssdeep: string
}

export type uploaded_blob_meta = {
  name: string
  size: number
  mimetype: mimetype
  uploaded: date_time_string
  originalFilename: string

  hash: fileHashes
  uploadedBy: {
    userId: user_id
    primarySessionId: string
  }
  originalSize?: number
  originalHash?: number
}

export type useTempFileResult = ok_ko<
  { assetRecord: d_u__d<assetRecord, 'type', 'uploaded'> },
  {
    tempNotFound: unknown
    move: {
      error: string
    }
    invalidFile: unknown
  }
>
