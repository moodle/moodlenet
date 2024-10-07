import { _nullish, date_time_string } from './data'
import { mimetype, mimetype_main } from './mime-types'

export type path = string[]

export type blob_meta = {
  size: number
  name: string
  created: date_time_string
  updated: _nullish | date_time_string
  mimetype: mimetype
  mainMimetype: mimetype_main
  originalCreated: _nullish | date_time_string
  hash: string
  fuzzyHash: string
}
