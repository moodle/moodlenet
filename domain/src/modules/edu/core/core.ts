import { moduleCore } from '../../../types'

export const edu_core: moduleCore<'edu'> = {
  modName: 'edu',
  service() {
    return
  },
  primary(ctx) {
    return {
      async session() {
        return {
          async moduleInfo() {
            const {
              configs: { eduPrimaryMsgSchemaConfigs },
            } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'edu' })
            return { schemaConfigs: eduPrimaryMsgSchemaConfigs }
          },
        }
      },
    }
  },
}
