import { mod_ctrl, statusOk } from '@moodle/core/domain'
import moodle_iam_mod from './mod'

export const ctrl: mod_ctrl<moodle_iam_mod> = {
  'current-user': {
    async get() {
      return statusOk({
        user: { kind: 'guest' } as const,
        permissions: {},
      })
    },
  },
}
