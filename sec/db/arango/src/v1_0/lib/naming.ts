import { mod_id } from '@moodle/domain'
import { lowerCase, snakeCase } from 'lodash'

export function normModIdName(mod_id: mod_id): string {
  return lowerCase(snakeCase(`${mod_id.ns}_${mod_id.mod}_${mod_id.version}`))
}
