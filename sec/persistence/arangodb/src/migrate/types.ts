import { _any } from '@moodle/lib/types'

export interface Migration_Record<record_v extends string> {
  v: record_v
  previous: string
  current: string
  date: string
  meta: _any
}
