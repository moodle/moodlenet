import { any_ } from '@moodle/lib-types'

export interface dbUpgradeData {
  previous: string
  current: string
  date: string
  meta: any_
}
