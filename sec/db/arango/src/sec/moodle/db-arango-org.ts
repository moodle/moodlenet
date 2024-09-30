import { moodle_secondary_adapter, moodle_secondary_factory } from '@moodle/domain'
import { _never } from '@moodle/lib-types'
import { db_struct } from '../../db-structure'
import { getModConfigs, updateDeepPartialModConfigs } from '../../lib/modules'

export function org_moodle_secondary_factory({
  db_struct,
}: {
  db_struct: db_struct
}): moodle_secondary_factory {
  return ctx => {
    const moodle_secondary_adapter: moodle_secondary_adapter = {
      secondary: {
        org: {
          db: {
            async getConfigs() {
              const configs = await getModConfigs({ domain_endpoint: ctx.invoked_by, db_struct })
              return configs
            },
            async updatePartialConfigs({ partialConfigs }) {
              const result = await updateDeepPartialModConfigs({
                domain_endpoint: ctx.invoked_by,
                db_struct,
                partialConfigs,
              })
              return [!!result, _never]
            },
          },
        },
      },
    }
    return moodle_secondary_adapter
  }
}
