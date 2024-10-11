import { moodle_core_factory, moodle_core_impl } from '@moodle/domain'
import { _void } from '@moodle/lib-types'
import { assert_authorizeAdminUserSession } from '@moodle/mod-iam/lib'

export function org_core(): moodle_core_factory {
  return ctx => {
    const moodle_core_impl: moodle_core_impl = {
      primary: {
        org: {
          session: {
            async moduleInfo() {
              const {
                configs: { info, orgPrimaryMsgSchemaConfigs },
              } = await ctx.sys_call.secondary.db.modConfigs.get({ mod: 'org' })
              return { info, schemaConfigs: orgPrimaryMsgSchemaConfigs }
            },
          },
          admin: {
            async updatePartialOrgInfo({ partialInfo }) {
              await assert_authorizeAdminUserSession(ctx)
              const [done] = await ctx.sys_call.secondary.db.modConfigs.updatePartial({
                mod: 'org',
                partialConfigs: { info: partialInfo },
              })
              return [done, _void]
            },
          },
        },
      },
    }
    return moodle_core_impl
  }
}
