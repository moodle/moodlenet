import { moduleCore } from '../../../types'

export const storage_core: moduleCore<'storage'> = {
  modName: 'storage',
  startBackgroundProcess(ctx) {
    delStales()
    function delStales() {
      ctx.log('debug', 'deleteStaleTemp files')
      ctx.write
        .deleteStaleTemp()
        .catch(e => ctx.log('warn', 'error deleteStaleTemp', e))
        .then(() =>
          ctx.mod.env.query.modConfigs({ mod: 'storage' }).catch(e => {
            ctx.log('alert', 'error query modConfigs, defaulting tempFileMaxRetentionSeconds to 10 minutes', e)
            return { configs: { tempFileMaxRetentionSeconds: 10 * 60 } }
          }),
        )
        .then(({ configs: { tempFileMaxRetentionSeconds } }) => setTimeout(delStales, tempFileMaxRetentionSeconds * 1000))
    }
  },
  primary(ctx) {
    return {
      session: {
        async moduleInfo() {
          const {
            configs: { uploadMaxSize },
          } = await ctx.mod.env.query.modConfigs({ mod: 'storage' })
          return { uploadMaxSizeConfigs: uploadMaxSize }
        },
      },
    }
  },
  watch(ctx) {
    return {
      secondary: {
        userProfile: {
          queue: {
            async createUserProfile([[done], { userProfile }]) {
              if (!done) {
                return
              }
              ctx.sync.createUserProfile({ userProfileId: userProfile.id })
            },
          },
        },
      },
    }
  },
}
