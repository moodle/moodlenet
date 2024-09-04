import { sec_factory } from '@moodle/core'

export function iam(): sec_factory {
  return ctx => {
    return {
      moodle: {
        iam: {
          V0_1: {
            sec: {
              userSession: {
                async validate({ primary, authToken }) {
                  const validateForPrimary = `${primary.name}@${primary.version}`

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
