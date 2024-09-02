import { factory } from '@moodle/core'
import { ArangoDBSecEnv } from '../../types/env'

export function eml_pwd_auth(_: ArangoDBSecEnv): factory<'sec'> {
  return ctx => {
    return {
      moodle: {
        eml_pwd_auth: {
          V0_1: {
            sec: {
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
