import { coreBootstrap } from '../../../types'

export const storage_core: coreBootstrap<'storage'> = ({ domain, log }) => {
  return {
    modName: 'storage',
    provider(coreCtx) {
      return {
        startBackgroundProcess() {
          delStales()
          function delStales() {
            log('debug', 'deleteStaleTemp files')
            coreCtx.write
              .deleteStaleTemp()
              .catch(e => log('warn', 'error deleteStaleTemp', e))
              .then(() =>
                coreCtx.mod.env.query.modConfigs({ mod: 'storage' }).catch(e => {
                  log('alert', 'error query modConfigs, defaulting tempFileMaxRetentionSeconds to 10 minutes', e)
                  return { configs: { tempFileMaxRetentionSeconds: 10 * 60 } }
                }),
              )
              .then(({ configs: { tempFileMaxRetentionSeconds } }) => setTimeout(delStales, tempFileMaxRetentionSeconds * 1000))
          }
        },
        primary(priCtx) {
          return {
            session: {
              async moduleInfo() {
                const {
                  configs: { uploadMaxSize },
                } = await coreCtx.mod.env.query.modConfigs({ mod: 'storage' })
                return { uploadMaxSizeConfigs: uploadMaxSize }
              },
            },
          }
        },
        watch(watchCtx) {
          return {
            secondary: {
              userHome: {
                write: {
                  async createUserHome([[done], { userHome }]) {
                    if (!done) {
                      return
                    }
                    return watchCtx.sync.createUserHome({ userHomeId: userHome.id })
                  },
                },
              },
            },
          }
        },
      }
    },
  }
}
