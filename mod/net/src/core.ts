import { core_factory } from '@moodle/lib-ddd'
import { assert_authorizeSystemSession } from '@moodle/mod-iam/v1_0/lib'

export function core(): core_factory {
  return ctx => {
    return {
      moodle: {
        net: {
          v1_0: {
            pri: {
              system: {
                async configs() {
                  await assert_authorizeSystemSession(ctx)
                  return ctx.worker.moodle.net.v1_0.sec.db.getConfigs()
                },
              },
            },
          },
        },
      },
    }
  }
}
