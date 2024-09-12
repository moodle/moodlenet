import { sec_factory } from '@moodle/domain'
import type * as _ from '@moodle/mod-net'
import { db_struct_0_1 } from '../../dbStructure/v0_1'
import { getModConfigs } from '../../lib/modules'

export function net({ db_struct_0_1 }: { db_struct_0_1: db_struct_0_1 }): sec_factory {
  return ctx => {
    return {
      moodle: {
        net: {
          v0_1: {
            sec: {
              db: {
                getConfigs() {
                  return getModConfigs({ mod_id: ctx.core_mod_id, db_struct_0_1 })
                },
              },
            },
          },
        },
      },
    }
  }
}
