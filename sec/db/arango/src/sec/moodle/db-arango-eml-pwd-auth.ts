import { sec_factory } from '@moodle/core'
import { db_struct_0_1 } from '../../dbStructure/0_1'
import { getModConfigs } from '../../lib/mod'

export const moodle_eml_pwd_auth_0_1 = 'moodle_eml_pwd_auth_0_1'
export function eml_pwd_auth({ db_struct_0_1 }: { db_struct_0_1: db_struct_0_1 }): sec_factory {
  return ctx => {
    return {
      moodle: {
        eml_pwd_auth: {
          V0_1: {
            sec: {
              read: {
                async configs() {
                  return getModConfigs({ db_struct_0_1, mod_int_id: moodle_eml_pwd_auth_0_1 })
                },
              },
            },
          },
        },
      },
    }
  }
}
