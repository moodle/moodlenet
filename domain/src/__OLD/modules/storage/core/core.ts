import { moduleCore } from '../../../types'
import * as timers from 'timers/promises'

const ONE_MINUTE = 60 * 1000
export const storage_core: moduleCore<'storage'> = {
  moduleName: 'storage',
  service() {
    return
  },
  startBackgroundProcess(ctx) {
    delStales()
    async function delStales() {
      ctx.log.debug('deleteStaleTemp files')
      await ctx.mod.secondary.storage.service.deleteStaleTemp()
      await timers.setTimeout(ONE_MINUTE)
      delStales()
    }
  },
  primary(ctx) {
    return {
      async session() {
        return {
          async moduleInfo() {
            const { configs } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'storage' })
            return { configs }
          },
        }
      },
    }
  },
  // watch(ctx) {
  //   return {
  //     secondary: {
  //       userProfile: {
  //         write: {
  //           async createUserProfile([[done], { userProfileRecord: userProfile }]) {
  //             if (!done) {
  //               return
  //             }
  //             ctx.sync.createUserProfile({ userProfileId: userProfile.id })
  //           },
  //         },
  //       },
  //     },
  //   }
  // },
}
