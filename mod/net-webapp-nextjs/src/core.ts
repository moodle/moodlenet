import { moodle_core_factory, moodle_core_impl } from '@moodle/domain'
import { assert_authorizeSystemSession } from '@moodle/mod-iam/lib'

export function net_webapp_nextjs_core(): moodle_core_factory {
  return ctx => {
    const moodle_core_impl: moodle_core_impl = {
      primary: {
        netWebappNextjs: {
          schemaConfigs: {
            async iam() {
              const iam = await ctx.sys_call.primary.iam.system.configs()
              return { iamSchemaConfigs: iam.configs.iamPrimaryMsgSchemaConfigs }
            },
            async moodleNet() {
              const net = await ctx.sys_call.primary.net.system.configs()
              return { moodleNetSchemaConfigs: net.configs.moodleNetPrimaryMsgSchemaConfigs }
            },
            async org() {
              const org = await ctx.sys_call.primary.org.system.configs()
              return { orgSchemaConfigs: org.configs.orgPrimaryMsgSchemaConfigs }
            },
          },
          webapp: {
            async layouts() {
              const {
                configs: { layouts },
              } = await ctx.sys_call.secondary.netWebappNextjs.db.getConfigs()
              return layouts
            },
          },
          moodlenet: {
            async info() {
              const [
                {
                  configs: { info },
                },
                {
                  configs: { info: org },
                },
              ] = await Promise.all([
                ctx.sys_call.primary.net.system.configs(),
                ctx.sys_call.primary.org.system.configs(),
              ])
              return { moodlenet: info, org }
            },
          },
          system: {
            async configs() {
              await assert_authorizeSystemSession(ctx)
              return ctx.sys_call.secondary.netWebappNextjs.db.getConfigs()
            },
          },
        },
      },
    }
    return moodle_core_impl
  }
}
