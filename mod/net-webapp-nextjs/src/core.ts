import { core_factory } from '@moodle/lib-ddd'
import { assert_authorizeSystemSession } from '@moodle/mod-iam/v1_0/lib'

export function core(): core_factory {
  return ctx => {
    return {
      moodle: {
        netWebappNextjs: {
          v1_0: {
            pri: {
              schemaConfigs: {
                async iam() {
                  const iam = await ctx.sysCall.moodle.iam.v1_0.pri.system.configs()
                  return { iamSchemaConfigs: iam.configs.primaryMsgSchemaConfigs }
                },
              },
              webapp: {
                async deployment() {
                  const {
                    configs: { deployment },
                  } = await ctx.sysCall.moodle.netWebappNextjs.v1_0.sec.db.getConfigs()
                  return deployment
                },
                async layouts() {
                  const {
                    configs: { layouts },
                  } = await ctx.sysCall.moodle.netWebappNextjs.v1_0.sec.db.getConfigs()
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
                    ctx.sysCall.moodle.net.v1_0.pri.system.configs(),
                    ctx.sysCall.moodle.org.v1_0.pri.system.configs(),
                  ])
                  return { info, org }
                },
              },
              system: {
                async configs() {
                  await assert_authorizeSystemSession(ctx)
                  return ctx.sysCall.moodle.netWebappNextjs.v1_0.sec.db.getConfigs()
                },
              },
            },
          },
        },
      },
    }
  }
}
