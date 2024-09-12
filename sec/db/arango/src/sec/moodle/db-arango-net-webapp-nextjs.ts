import { sec_factory } from '@moodle/domain'
import type {} from '@moodle/mod-net-webapp-nextjs'
import { db_struct_0_1 } from '../../dbStructure/v0_1'
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
                  const [{ configs: me }, { configs: net }, { configs: org }] = await Promise.all([
                    getModConfigs({ mod_id: ctx.core_mod_id, db_struct_0_1 }),
                    getModConfigs({
                      // FIXME: let mod defs export their own mod_id --- nope check TODO #1
                      mod_id: { ns: 'moodle', mod: 'net', version: 'v0_1' },
                      db_struct_0_1,
                    }),
                    getModConfigs({
                      // FIXME: let mod defs export their own mod_id --- nope check TODO #1
                      mod_id: { ns: 'moodle', mod: 'org', version: 'v0_1' },
                      db_struct_0_1,
                    }),
                  ])
                  return { me, net, org }
                },
              },
            },
          },
        },
      },
    }
  }
}
