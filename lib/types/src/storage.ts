import { AuthenticatedSession } from 'domain/src/iam'
import { date_time_string } from './data'
import { mimetype } from './mime-types'

export type path = string[]

export type blob_meta = {
  size: number
  originalFilename: string
  created: date_time_string
  mimetype: mimetype
}

export type temp_blob_meta = blob_meta & {
  userSession: AuthenticatedSession
}

export type dir<_dir> = {
  [key in keyof _dir]: _dir[key] extends file ? file : dir<_dir[key]>
}
export type file = () => path
