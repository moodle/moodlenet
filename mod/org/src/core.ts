import { core_factory } from '@moodle/lib-ddd'
import { assert_authorizeSystemSession } from '@moodle/mod-iam/v1_0/lib'

export * as v1_0 from './v1_0/types'

export function core(): core_factory {
  return ctx => {
    return {
      moodle: {
        org: {
          v1_0: {
            pri: {
              system: {
                async configs() {
                  await assert_authorizeSystemSession(ctx)
                  return ctx.worker.moodle.org.v1_0.sec.db.getConfigs()
                },
              },
            },
          },
        },
      },
    }
  }
}
