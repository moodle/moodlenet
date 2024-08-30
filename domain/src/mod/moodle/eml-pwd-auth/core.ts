import { _any } from '@moodle/lib/types'
import { CoreContext } from 'domain/src/types/core-context'
import { module } from './mod'

export function core(coreContext: CoreContext): module {
  return {
    V0_1: {
      prm: null as _any,
      // sec: null as _any,
      // emit: null as _any,
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
  }
}
