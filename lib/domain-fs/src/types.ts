import { date_time_string, mimetype, ok_ko, path } from '@moodle/lib-types'

export type uploadedFileMeta = {
  date: date_time_string
  primarySessionId: string
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

export type domainFsDirectories = {
  currentDomainDir: string
  temp: string
}

export type tempFilePaths = {
  file: string
  meta: string
}
