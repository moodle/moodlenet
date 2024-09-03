import { factory } from '@moodle/core'
import { SessionCtx } from '../../session-ctx'

export const moodle_net_mod_name = 'moodle-net'
export function net(): factory<'sec'> {
  return ctx => {
    const { db_struct_0_1: db_struct } = SessionCtx.getStore()
    return {
      moodle: {
        net: {
          V0_1: {
            sec: {
              read: {
                async configs() {
                  const configs =
                    await db_struct.data.coll.module_configs.document(moodle_net_mod_name)
                  if (!configs) {
                    throw new Error(`${moodle_net_mod_name} config not found`)
                  }
                  return configs
                },
              },
            },
          },
        },
      },
    }
  }
}

