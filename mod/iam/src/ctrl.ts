import { mod_ctrl, statusOk } from '@moodle/core/domain'

export const ctrl: mod_ctrl<'iam'> = {
  iam: {
    'current-user': {
      async get() {
        return statusOk({
          user: { kind: 'guest' } as const,
          permissions: {},
        })
      },
    },
  },
}
