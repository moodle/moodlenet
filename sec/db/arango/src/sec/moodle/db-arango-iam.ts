import { sec_factory } from '@moodle/core'
import { db_struct_0_1 } from '../../dbStructure/0_1'

export function iam({ db_struct_0_1 }: { db_struct_0_1: db_struct_0_1 }): sec_factory {
  return ctx => {
    return {
      moodle: {
        iam: {
          V0_1: {
            sec: {
              userSession: {
                async validate({ primary, authToken }) {
                  const validateForPrimary = `${primary.name}@${primary.version}`
                  validateForPrimary
                  return !authToken
                    ? {
                        user: { type: 'guest' } as const,
                        // permissions: {
                        //   moodle: {
                        //     eml_pwd_auth: { V0_1: { prm: { a: { b: 32 } } } },
                        //     iam: { V0_1: { prm: undefined } },
                        //     net: { V0_1: { prm: undefined } },
                        //   },
                        // },
                      }
                    : {
                        user: { type: 'authenticated', id: authToken },
                        // permissions: {
                        //   moodle: {
                        //     eml_pwd_auth: { V0_1: { prm: { a: { b: 32 } } } },
                        //     iam: { V0_1: { prm: undefined } },
                        //     net: { V0_1: { prm: undefined } },
                        //   },
                        // },
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
