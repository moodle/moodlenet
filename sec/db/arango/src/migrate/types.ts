import { any_ } from '@moodle/lib-types'

export interface migrationRecord {
  previous: string
  current: string
  date: string
  meta: any_
}
