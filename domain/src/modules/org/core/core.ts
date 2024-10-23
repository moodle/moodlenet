import { moduleCore } from '../../../types'

export const org_core: moduleCore<'org'> = {
  modName: 'org',
  primary(ctx) {
    return {
      session: {
        async moduleInfo() {
          const {
            configs: { info, orgPrimaryMsgSchemaConfigs },
          } = await ctx.mod.env.query.modConfigs({ mod: 'org' })
          return { info, schemaConfigs: orgPrimaryMsgSchemaConfigs }
        },
      },
      admin: {
        async updatePartialOrgInfo({ partialInfo }) {
          return ctx.mod.env.service.updatePartialConfigs({
            mod: 'org',
            partialConfigs: { info: partialInfo },
          })
        },
      },
    }
  },
}
