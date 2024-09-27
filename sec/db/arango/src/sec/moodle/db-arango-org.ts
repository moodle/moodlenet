import { sec_factory } from '@moodle/lib-ddd'
import { db_struct } from '../../db-structure'
import { getModConfigs, updateDeepPartialModConfigs } from '../../lib/modules'
import { _never } from '@moodle/lib-types'

export function org({ db_struct }: { db_struct: db_struct }): sec_factory {
  return ctx => {
    return {
      moodle: {
        org: {
          v1_0: {
            sec: {
              db: {
                async getConfigs() {
                  const configs = await getModConfigs({ mod_id: ctx.invoked_by, db_struct })
                  return configs
                },
                async updatePartialConfigs({ partialConfigs }) {
                  const result = await updateDeepPartialModConfigs({
                    mod_id: ctx.invoked_by,
                    db_struct,
                    partialConfigs,
                  })
                  return [!!result, _never]
                },
              },
            },
          },
        },
      },
    }
  }
}
