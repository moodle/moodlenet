import { sec_factory } from '@moodle/lib-ddd'
import type {} from '@moodle/mod-net-webapp-nextjs'
import { getModConfigs } from '../../lib/modules'
import { db_struct } from '../../db-structure'

export function netWebappNextjs({ db_struct }: { db_struct: db_struct }): sec_factory {
  return ctx => {
    return {
      moodle: {
        netWebappNextjs: {
          v1_0: {
            sec: {
              db: {
                async getConfigs() {
                  const { configs } = await getModConfigs({
                    mod_id: ctx.invoked_by,
                    db_struct,
                  })
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
