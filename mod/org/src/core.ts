import { core_factory } from '@moodle/lib-ddd'
import { _never } from '@moodle/lib-types'
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
                  return ctx.sysCall.moodle.org.v1_0.sec.db.getConfigs()
                },
              },
              admin: {
                async updatePartialOrgInfo({ partialInfo }) {
                  const [done] = await ctx.sysCall.moodle.org.v1_0.sec.db.updatePartialConfigs({
                    partialConfigs: { info: partialInfo },
                  })
                  return [done, _never]
                },
              },
            },
          },
        },
      },
    }
  }
}
