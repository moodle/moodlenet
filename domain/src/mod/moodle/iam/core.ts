import { factory } from 'domain/src/types'

export function core(): factory<'pri'> {
  return ctx => {
    return {
      moodle: {
        iam: {
          V0_1: {
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
        },
      },
    }
  }
}
