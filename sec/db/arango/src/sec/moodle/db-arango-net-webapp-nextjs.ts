import { sec_factory } from '@moodle/domain'
import type {} from '@moodle/mod-net-webapp-nextjs'
import { db_struct_v1_0 } from '../../dbStructure/v1_0'
import { getModConfigs } from '../../lib/modules'

export function netWebappNextjs({
  db_struct_v1_0,
}: {
  db_struct_v1_0: db_struct_v1_0
}): sec_factory {
  return ctx => {
    return {
      moodle: {
        netWebappNextjs: {
          v1_0: {
            sec: {
              db: {
                async getConfigs() {
                  const [{ configs: nextjs }, { configs: net }, { configs: org }] =
                    await Promise.all([
                      getModConfigs({ mod_id: ctx.core_mod_id, db_struct_v1_0 }),
                      getModConfigs({
                        // FIXME: let mod defs export their own mod_id --- nope check TODO #1
                        mod_id: { ns: 'moodle', mod: 'net', version: 'v1_0' },
                        db_struct_v1_0,
                      }),
                      getModConfigs({
                        // FIXME: let mod defs export their own mod_id --- nope check TODO #1
                        mod_id: { ns: 'moodle', mod: 'org', version: 'v1_0' },
                        db_struct_v1_0,
                      }),
                    ])
                  return { nextjs, net, org }
                },
              },
            },
          },
        },
      },
    }
  }
}
