import { moodle_secondary_adapter, moodle_secondary_factory } from '@moodle/domain'
import type {} from '@moodle/mod-net-webapp-nextjs'
import { db_struct } from '../db-structure'

export function net_webapp_nextjs_moodle_secondary_factory({
  db_struct,
}: {
  db_struct: db_struct
}): moodle_secondary_factory {
  return ctx => {
    const moodle_secondary_adapter: moodle_secondary_adapter = {
      secondary: {},
    }
    return moodle_secondary_adapter
  }
}
