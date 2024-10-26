import { moduleCore } from '../../../types'

export const moodlenet_react_app_core: moduleCore<'moodlenetReactApp'> = {
  modName: 'moodlenetReactApp',
  service() {
    return
  },
  primary(ctx) {
    return {
      webapp: {
        async layouts() {
          const {
            configs: { layouts },
          } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'moodlenetReactApp' })
          return layouts
        },
      },
    }
  },
}
