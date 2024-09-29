import { core_factory } from '@moodle/lib-ddd'
import { _never } from '@moodle/lib-types'
import { assert_authorizeSystemSession } from '@moodle/mod-iam/lib'

export { Configs, OrgInfo, orgInfoForm, OrgPrimaryMsgSchemaConfigs } from './types'

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
                  return ctx.sys_call.moodle.org.sec.db.getConfigs()
                },
              },
              admin: {
                async updatePartialOrgInfo({ partialInfo }) {
                  const [done] = await ctx.sys_call.moodle.org.sec.db.updatePartialConfigs({
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
