import { date_time_string, path } from './data'
import { ok_ko } from './domain-msg'
import { mimetype } from './mime-types'

export type fileAssetMeta = fileMeta & {
  hash: fileHashes
  uploaded: null | uploadedFileMeta
}
export type uploadedFileMeta = {
  date: date_time_string
  primarySessionId: string
  original?: {
    name: string
    size?: number
    hash?: fileHashes
  }
}
export type fileHashes = {
  sha256: string
  // ssdeep: string
}
export type fileMeta = {
  name: string
  size: number
  mimetype: mimetype
}

export type useTempFileResult = ok_ko<
  {
    fileAssetMeta: fileAssetMeta
    path: path
  },
  {
    tempNotFound: unknown
    move: {
      error: string
    }
    invalidFile: unknown
  }
>
