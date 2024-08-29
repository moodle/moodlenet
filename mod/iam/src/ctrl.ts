import { mod_ctrl, replyOk } from '@moodle/domain'

export const ctrl: mod_ctrl<'iam'> = {
  iam: {
    'current-session': {
      async auth() {
        return replyOk({
          user: { type: 'guest' } as const,
          permissions: {},
        })
      },
    },
  },
}
