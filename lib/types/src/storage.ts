import { _nullish, date_time_string } from './data'
import { mimetype } from './mime-types'

export type path = string[]

export type blob_meta = {
  size: number
  originalFilename: string
  created: date_time_string
  mimetype: mimetype
  originalCreated: _nullish | date_time_string
}
