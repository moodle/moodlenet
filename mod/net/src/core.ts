import { core_factory } from '@moodle/lib-ddd'
import { _never } from '@moodle/lib-types'
import { assert_authorizeSystemSession } from '@moodle/mod-iam/lib'

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
                  return ctx.sys_call.moodle.net.sec.db.getConfigs()
                },
              },
              admin: {
                async updatePartialMoodleNetInfo({ partialInfo }) {
                  const [done] = await ctx.sys_call.moodle.net.sec.db.updatePartialConfigs({
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
