import { d_u, path } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'

export type uploadedFileMeta = moo.def.content.fileMeta & {
  requestClaims: moo.def.gate.provider.request.claims
  original?: {
    name: string
    size?: number
  }
}

// export type fileHashes = {
//   sha256: string
//   // ssdeep: string
// }

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
    fileMeta: moo.def.content.fileMeta
    path: path
  }
>

export type tempFilePaths = {
  file: string
  uploadedFileMeta: string
}
