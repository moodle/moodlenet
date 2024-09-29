import { core_factory } from '@moodle/lib-ddd'
import { assert_authorizeSystemSession } from '@moodle/mod-iam/lib'
import assert from 'node:assert'

export function core(): core_factory {
  return ctx => {
    return {
      moodle: {
        v1_0: {
          netWebappNextjs: {
            pri: {
              schemaConfigs: {
                async iam() {
                  const iam = await ctx.sys_call.moodle.iam.pri.system.configs()
                  return { iamSchemaConfigs: iam.configs.iamPrimaryMsgSchemaConfigs }
                },
                async moodleNet() {
                  const net = await ctx.sys_call.moodle.net.pri.system.configs()
                  return { moodleNetSchemaConfigs: net.configs.moodleNetPrimaryMsgSchemaConfigs }
                },
                async org() {
                  const org = await ctx.sys_call.moodle.org.pri.system.configs()
                  return { orgSchemaConfigs: org.configs.orgPrimaryMsgSchemaConfigs }
                },
              },
              webapp: {
                async deploymentInfo() {
                  const deployments = await ctx.sys_call.env.deployments.sec.info.read()
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
                  } = await ctx.sys_call.moodle.netWebappNextjs.sec.db.getConfigs()
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
                    ctx.sys_call.moodle.net.pri.system.configs(),
                    ctx.sys_call.moodle.org.pri.system.configs(),
                  ])
                  return { moodlenet: info, org }
                },
              },
              system: {
                async configs() {
                  await assert_authorizeSystemSession(ctx)
                  return ctx.sys_call.moodle.netWebappNextjs.sec.db.getConfigs()
                },
              },
            },
          },
        },
      },
    }
  }
}
