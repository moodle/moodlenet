import { _any } from '@moodle/lib-types'

export interface migrationRecord {
  previous: string
  current: string
  date: string
  meta: _any
}
