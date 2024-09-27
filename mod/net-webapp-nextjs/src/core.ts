import { core_factory } from '@moodle/lib-ddd'
import { assert_authorizeSystemSession } from '@moodle/mod-iam/v1_0/lib'
import assert from 'node:assert'

export function core(): core_factory {
  return ctx => {
    return {
      moodle: {
        netWebappNextjs: {
          v1_0: {
            pri: {
              schemaConfigs: {
                async iam() {
                  const iam = await ctx.sys_call.moodle.iam.v1_0.pri.system.configs()
                  return { iamSchemaConfigs: iam.configs.iamPrimaryMsgSchemaConfigs }
                },
                async moodleNet() {
                  const net = await ctx.sys_call.moodle.net.v1_0.pri.system.configs()
                  return { moodleNetSchemaConfigs: net.configs.moodleNetPrimaryMsgSchemaConfigs }
                },
                async org() {
                  const org = await ctx.sys_call.moodle.org.v1_0.pri.system.configs()
                  return { orgSchemaConfigs: org.configs.orgPrimaryMsgSchemaConfigs }
                },
              },
              webapp: {
                async deploymentInfo() {
                  const deployments = await ctx.sys_call.env.deployments.v1_0.sec.info.read()
                  const moodleNetWebappDeploymentInfo =
                    deployments.moodle.net.MoodleNetWebappDeploymentInfo
                  assert(
                    moodleNetWebappDeploymentInfo,
                    new Error('No deployment info for MoodleNetWebappDeploymentInfo !'),
                  )

                  return moodleNetWebappDeploymentInfo
                },
                async layouts() {
                  const {
                    configs: { layouts },
                  } = await ctx.sys_call.moodle.netWebappNextjs.v1_0.sec.db.getConfigs()
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
                    ctx.sys_call.moodle.net.v1_0.pri.system.configs(),
                    ctx.sys_call.moodle.org.v1_0.pri.system.configs(),
                  ])
                  return { moodlenet: info, org }
                },
              },
              system: {
                async configs() {
                  await assert_authorizeSystemSession(ctx)
                  return ctx.sys_call.moodle.netWebappNextjs.v1_0.sec.db.getConfigs()
                },
              },
            },
          },
        },
      },
    }
  }
}
