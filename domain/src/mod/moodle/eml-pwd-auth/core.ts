import { _any } from '@moodle/lib/types'
import { factory } from 'domain/src/types'

export function core(): factory<'pri'> {
  return ctx => {
    return {
      moodle: {
        eml_pwd_auth: {
          V0_1: {
            pri: {
              read: {
                async configs() {
                  return {
                    configs: {
                      loginForm: {
                        email: { min: 5, max: 35 },
                        password: { min: 8, max: 35 },
                      },
                      signupForm: {
                        email: { min: 5, max: 35 },
                        password: { min: 8, max: 35 },
                        displayName: { min: 3, max: 35 },
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
