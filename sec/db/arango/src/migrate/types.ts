import { _any } from '@moodle/lib-types'

export interface Migration_Record {
  previous: string
  current: string
  date: string
  meta: _any
}
