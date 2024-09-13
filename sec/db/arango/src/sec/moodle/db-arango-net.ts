import { sec_factory } from '@moodle/domain'
import type * as _ from '@moodle/mod-net'
import { db_struct_v1_0 } from '../../dbStructure/v1_0'
import { getModConfigs } from '../../lib/modules'

export function net({ db_struct_v1_0 }: { db_struct_v1_0: db_struct_v1_0 }): sec_factory {
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
