import { moduleCore } from '../../../types'

export const moodlenet_nextjs_core: moduleCore<'moodlenetNextjs'> = {
  modName: 'moodlenetNextjs',
  primary(ctx) {
    return {
      webapp: {
        async layouts() {
          const {
            configs: { layouts },
          } = await ctx.mod.env.query.modConfigs({ mod: 'moodlenetNextjs' })
          return layouts
        },
      },
    }
  },
}
