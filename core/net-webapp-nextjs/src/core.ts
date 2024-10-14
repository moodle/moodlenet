import { coreBootstrap } from '@moodle/domain'

export const net_webapp_nextjs_core: coreBootstrap<'netWebappNextjs'> = domain => {
  return core => {
    return {
      netWebappNextjs: {
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
      },
    }
  }
}
