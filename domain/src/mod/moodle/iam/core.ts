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
        currentSession: {
          async auth() {
            return {
              user: { type: 'guest' } as const,
              permissions: {},
            }
          },
        },
      },
    },
  }
}
