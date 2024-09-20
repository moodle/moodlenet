import { sec_factory } from '@moodle/lib-ddd'
import { v1_0 } from '../..'
import { getModConfigs } from '../../v1_0/lib/modules'

export function net({ db_struct_v1_0 }: { db_struct_v1_0: v1_0.db_struct }): sec_factory {
  return ctx => {
    return {
      moodle: {
        net: {
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
