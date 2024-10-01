import { moodle_core_factory, moodle_core_impl } from '@moodle/domain'
import { getDeploymentInfoUrl } from '@moodle/lib-ddd'
import { _void, path } from '@moodle/lib-types'
import { assert_authorizeSystemSession } from '@moodle/mod-iam/lib'

export function storage_core(): moodle_core_factory {
  return ctx => {
    const moodle_core_impl: moodle_core_impl = {
      primary: {
        storage: {
          read: {
            async getUrl({ path, proto }) {
              const modulewise_path = await assert_systemCall_get_modulewise_path(path)
              const httpFileServerDeployment =
                proto === 'http'
                  ? await ctx.sys_call.primary.env.application.deployment({ app: 'filestore-http' })
                  : null

              if (!httpFileServerDeployment) {
                return [false, { reason: 'notDeployed' }]
              }

              const url = getDeploymentInfoUrl(httpFileServerDeployment, modulewise_path)
              return [true, { url }]
            },
          },
          write: {
            async deletePath({ path, type }) {
              const modulewise_path = await assert_systemCall_get_modulewise_path(path)
              const result = await ctx.sys_call.secondary.storage.store.deletePath({
                path: modulewise_path,
                type,
              })
              return result
            },
          },
          temp: {
            async useTemp({ tmpId, destPath }) {
              const [found, foundTmp] = await ctx.sys_call.secondary.storage.store.getTempMeta({
                tmpId,
              })
              if (!found) {
                return [false, { reason: 'notFound' }]
              }
              const modulewise_destination_path =
                await assert_systemCall_get_modulewise_path(destPath)

              const [movedTmp, notMovedTmpReason] =
                await ctx.sys_call.secondary.storage.store.mvTempFile({
                  tmpId,
                  destFullPath: modulewise_destination_path,
                })
              if (!movedTmp) {
                return [false, notMovedTmpReason]
              }

              const [savedMeta, notSavedMetaReason] =
                await ctx.sys_call.secondary.storage.db.saveMeta({
                  path: modulewise_destination_path,
                  meta: foundTmp.meta,
                  replace: true,
                })
              if (!savedMeta) {
                ctx.sys_call.secondary.storage.store.deletePath({
                  path: modulewise_destination_path,
                  type: 'file',
                })
                return [false, notSavedMetaReason]
              }

              return [true, _void]
            },
          },
        },
      },
    }
    return moodle_core_impl
    async function assert_systemCall_get_modulewise_path(path: path): Promise<path> {
      const modulename = (await assert_authorizeSystemSession(ctx)).from.module
      return [modulename, ...path]
    }
  }
}
