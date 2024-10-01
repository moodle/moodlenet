import { _nil, date_time_string } from './data'

export type path = string[]
export type blob_types = 'image' | 'video' | 'audio' | 'document' | 'other'

export type blob_meta = {
  size: number
  name: string
  created: date_time_string
  updated: _nil | date_time_string
  mimetype: string
  originalCreated: _nil | date_time_string
  blob_type: blob_types
}
