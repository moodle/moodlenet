import { date_time_string, mimetype, ok_ko } from '@moodle/lib-types'
import { user_id } from '../../iam'

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
  hash: fileHashes
  uploadedBy: {
    userId: user_id
    primarySessionId: string
  }
  originalFilename: string
  originalSize?: number
  originalHash?: number
}

export type webImageSize = 'small' | 'medium' | 'large'
export type webImageResizesConfigs = {
  small: number
  medium: number
  large: number
}

export type uploadMaxSizeConfigs = {
  max: number
  webImage: number
}

export interface Configs {
  uploadMaxSize: uploadMaxSizeConfigs
  webImageResizes: webImageResizesConfigs
  tempFileMaxRetentionSeconds: number
}

export type useTempFileResult = ok_ko<
  { blobMeta: uploaded_blob_meta },
  {
    tempNotFound: unknown
    move: {
      error: string
    }
  }
>

export type useTempFileAsWebImageResult = ok_ko<
  { blobMeta: uploaded_blob_meta },
  {
    tempNotFound: unknown
    move: {
      error: string
    }
    invalidImage: unknown
  }
>
