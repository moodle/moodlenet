import { sec_factory } from '@moodle/domain'
import type {} from '@moodle/mod-net-webapp-nextjs'
import { db_struct_0_1 } from '../../dbStructure/0_1'
import { getModConfigs } from '../../lib/modules'

export function netWebappNextjs({ db_struct_0_1 }: { db_struct_0_1: db_struct_0_1 }): sec_factory {
  return ctx => {
    return {
      moodle: {
        netWebappNextjs: {
          v0_1: {
            sec: {
              db: {
                async getConfigs() {
                  const [{ configs: net }, { configs }] = await Promise.all([
                    getModConfigs({
                      // FIXME: let mod defs export their own mod_id
                      mod_id: { ns: 'moodle', mod: 'net', version: 'v0_1' },
                      db_struct_0_1,
                    }),
                    getModConfigs({ mod_id: ctx.core_mod_id, db_struct_0_1 }),
                  ])
                  return {
                    configs: {
                      ...configs,
                      net,
                    },
                  }
                },
              },
            },
          },
        },
      },
    }
  }
}
