import { factory } from '@moodle/domain'
import { ArangoDBSecEnv } from '../../types/env'

export function iam(_: ArangoDBSecEnv): factory<'sec'> {
  return ctx => {
    return {
      moodle: {
        iam: {
          V0_1: {
            sec: {
              userSession: {
                async validate({ primarySession }) {
                  const authToken = primarySession.session.authToken
                  return !authToken
                    ? {
                        user: { type: 'guest' } as const,
                        permissions: {
                          moodle: {
                            eml_pwd_auth: { V0_1: { prm: { a: { b: 32 } } } },
                            iam: { V0_1: { prm: undefined } },
                            net: { V0_1: { prm: undefined } },
                          },
                        },
                      }
                    : {
                        user: { type: 'authenticated', id: authToken },
                        permissions: {
                          moodle: {
                            eml_pwd_auth: { V0_1: { prm: { a: { b: 32 } } } },
                            iam: { V0_1: { prm: undefined } },
                            net: { V0_1: { prm: undefined } },
                          },
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
