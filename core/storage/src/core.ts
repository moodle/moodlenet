import { coreBootstrap } from '@moodle/domain'

export const storage_core: coreBootstrap<'storage'> = domain => {
  return {
    modName: 'storage',
    provider(coreCtx) {
      return {
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
