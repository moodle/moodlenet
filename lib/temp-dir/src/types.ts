import { d_u, date_time_string, mimetype, path } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'

export type uploadedFileMeta = fileMeta & {
  requestClaims: moo.gate.provider.requestClaims
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
  uploaded: null | {
    date: date_time_string
    by: moo.permissions.user.info.user
  }
}

export type useTempFileResult = Either<
  d_u<
    {
      tempNotFound: unknown
      move: {
        error: string
      }
      invalidFile: unknown
    },
    'reason'
  >,
  {
    fileMeta: fileMeta
    path: path
  }
>

export type tempFilePaths = {
  file: string
  uploadedFileMeta: string
}
