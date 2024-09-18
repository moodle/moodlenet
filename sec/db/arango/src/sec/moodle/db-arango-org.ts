import { sec_factory } from '@moodle/domain'
import { db_struct } from '../../v1_0/db-structure'
import { getModConfigs } from '../../v1_0/lib/modules'

export function org({ db_struct_v1_0 }: { db_struct_v1_0: db_struct }): sec_factory {
  return ctx => {
    return {
      moodle: {
        org: {
          v1_0: {
            sec: {
              db: {
                getConfigs() {
                  return getModConfigs({ mod_id: ctx.core_mod_id, db_struct_v1_0 })
                },
              },
            },
          },
        },
      },
    }
  }
}
