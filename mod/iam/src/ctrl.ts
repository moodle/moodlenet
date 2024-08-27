import { mod_ctrl } from '@moodle/core/domain'
import { statusOk } from 'core/domain/src/domain/access-status'
import moodlenet_mod from './mod'

export const ctrl: mod_ctrl<moodlenet_mod> = {
  'current-user': {
    async get() {
      return statusOk({
        user: { kind: 'guest' } as const,
        permissions: {},
      })
    },
  },
}
