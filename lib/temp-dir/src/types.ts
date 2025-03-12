import { date_time_string, mimetype, ok_ko, path } from '@moodle/lib-types'

export type uploadedFileMeta = {
  date: date_time_string
  requestInfo: moo.gate.provider.requestInfo
  original?: {
    name: string
    size?: number
  }
}

// export type fileHashes = {
//   sha256: string
//   // ssdeep: string
// }

export type fileMeta = {
  name: string
  size: number
  mimetype: mimetype
  uploaded: null | uploadedFileMeta
}

export type useTempFileResult = ok_ko<
  {
    fileMeta: fileMeta
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

export type tempFilePaths = {
  file: string
  meta: string
}
