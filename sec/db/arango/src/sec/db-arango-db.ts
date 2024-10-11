import { moodle_secondary_adapter, moodle_secondary_factory } from '@moodle/domain'
import { _void } from '@moodle/lib-types'
import { db_struct } from '../db-structure'
import { getModConfigs, updateDeepPartialModConfigs } from '../lib'

export function db_moodle_secondary_factory({
  db_struct,
}: {
  db_struct: db_struct
}): moodle_secondary_factory {
  return ctx => {
    const moodle_secondary_adapter: moodle_secondary_adapter = {
      secondary: {
        db: {
          modConfigs: {
            async get({ mod }) {
              const configs = await getModConfigs({
                moduleName: mod,
                db_struct,
              })
              return configs
            },
            async updatePartial({ partialConfigs, mod }) {
              const result = await updateDeepPartialModConfigs({
                moduleName: mod,
                db_struct,
                partialConfigs,
              })
              return [!!result, _void]
            },
          },
        },
      },
    }
    return moodle_secondary_adapter
  }
}
