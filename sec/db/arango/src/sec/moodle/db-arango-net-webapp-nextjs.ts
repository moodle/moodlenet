import { sec_factory } from '@moodle/lib-ddd'
import type {} from '@moodle/mod-net-webapp-nextjs'
import { db_struct } from '../../v1_0/db-structure'
import { getModConfigs } from '../../v1_0/lib/modules'

export function netWebappNextjs({ db_struct_v1_0 }: { db_struct_v1_0: db_struct }): sec_factory {
  return ctx => {
    return {
      moodle: {
        netWebappNextjs: {
          v1_0: {
            sec: {
              db: {
                async getConfigs() {
                  const { configs } = await
                  getModConfigs({ mod_id: ctx.core_mod_id, db_struct_v1_0 })
                  return { configs }
                },
              },
            },
          },
        },
      },
    }
  }
}
