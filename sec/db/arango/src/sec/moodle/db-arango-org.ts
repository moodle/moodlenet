import { sec_factory } from '@moodle/lib-ddd'
import { db_struct } from '../../v1_0/db-structure'
import { getModConfigs, updateDeepPartialModConfigs } from '../../v1_0/lib/modules'
import { _never } from '@moodle/lib-types'

export function org({ db_struct_v1_0 }: { db_struct_v1_0: db_struct }): sec_factory {
  return ctx => {
    return {
      moodle: {
        org: {
          v1_0: {
            sec: {
              db: {
                async getConfigs() {
                  const configs = await getModConfigs({ mod_id: ctx.modIdCaller, db_struct_v1_0 })
                  return configs
                },
                async updatePartialConfigs({ partialConfigs }) {
                  const result = await updateDeepPartialModConfigs({
                    mod_id: ctx.modIdCaller,
                    db_struct_v1_0,
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
