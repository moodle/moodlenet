import { moduleCore } from '../../../types'

export const net_webapp_nextjs_core: moduleCore<'netWebappNextjs'> = {
  modName: 'netWebappNextjs',
  primary(ctx) {
    return {
      webapp: {
        async layouts() {
          const {
            configs: { layouts },
          } = await ctx.mod.env.query.modConfigs({ mod: 'netWebappNextjs' })
          return layouts
        },
      },
    }
  },
}
