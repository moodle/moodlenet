import { sec_factory } from '@moodle/core'
import { SessionCtx } from '../../session-ctx'

export const moodle_eml_pwd_auth_mod_name = 'moodle-eml-pwd-auth'
export function eml_pwd_auth(): sec_factory {
  return ctx => {
    const { db_struct_0_1: db_struct } = SessionCtx.getStore()
    return {
      moodle: {
        eml_pwd_auth: {
          V0_1: {
            sec: {
              read: {
                async configs() {
                  return {
                    configs: await db_struct.data.coll.module_configs.document(
                      moodle_eml_pwd_auth_mod_name,
                    ),
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
