import { coreBootstrap } from '../../../types'

export const org_core: coreBootstrap<'org'> = domain => {
  return {
    modName: 'org',
    provider(coreCtx) {
      return {
        primary(priCtx) {
          return {
            session: {
              async moduleInfo() {
                const {
                  configs: { info, orgPrimaryMsgSchemaConfigs },
                } = await coreCtx.mod.env.query.modConfigs({ mod: 'org' })
                return { info, schemaConfigs: orgPrimaryMsgSchemaConfigs }
              },
            },
            admin: {
              async updatePartialOrgInfo({ partialInfo }) {
                return coreCtx.mod.env.service.updatePartialConfigs({
                  mod: 'org',
                  partialConfigs: { info: partialInfo },
                })
              },
            },
          }
        },
      }
    },
  }
}
