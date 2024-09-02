import { factory } from 'domain/src/types'

export function core(): factory<'pri'> {
  return ({ primarySession, worker }) => {
    const mysec = worker.moodle.iam.V0_1.sec
    return {
      moodle: {
        iam: {
          V0_1: {
            pri: {
              userSession: {
                async current() {
                  return mysec.userSession.validate({ primarySession })
                },
              },
            },
          },
        },
      },
    }
  }
}
