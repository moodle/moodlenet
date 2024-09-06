import { sec_factory } from '@moodle/domain'
import type * as _ from '@moodle/mod-iam'
import { db_struct_0_1 } from '../../dbStructure/0_1'
import { getModConfigs } from '../../lib/modules'

export function iam({ db_struct_0_1 }: { db_struct_0_1: db_struct_0_1 }): sec_factory {
  return ctx => {
    return {
      moodle: {
        iam: {
          v0_1: {
            sec: {
              db_read: {
                configs() {
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
