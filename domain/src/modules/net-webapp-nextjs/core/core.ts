import { coreBootstrap } from '../../../types'

export const net_webapp_nextjs_core: coreBootstrap<'netWebappNextjs'> = domain => {
  return {
    modName: 'netWebappNextjs',
    provider(core) {
      return {
        primary(primary) {
          return {
            webapp: {
              async layouts() {
                const {
                  configs: { layouts },
                } = await core.mod.env.query.modConfigs({ mod: 'netWebappNextjs' })
                return layouts
              },
            },
          }
        },
      }
    },
  }
}
