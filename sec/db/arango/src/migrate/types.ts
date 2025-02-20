import { any_ } from '@moodle/lib-types'

export interface dbMigrationRecord {
  previous: string
  current: string
  date: string
  meta: any_
}
