import { coreBootstrap } from '@moodle/domain'
import { _void } from '@moodle/lib-types'

export const net_core: coreBootstrap<'net'> = domain => {
  return {
    modName: 'net',
    provider(coreCtx) {
      return {
        primary(priCtx) {
          return {
            session: {
              async moduleInfo() {
                const {
                  configs: { info, moodleNetPrimaryMsgSchemaConfigs },
                } = await coreCtx.mod.env.query.modConfigs({ mod: 'net' })
                return { info, schemaConfigs: moodleNetPrimaryMsgSchemaConfigs }
              },
            },

            admin: {
              async updatePartialMoodleNetInfo({ partialInfo }) {
                const [done] = await coreCtx.mod.env.service.updatePartialConfigs({
                  mod: 'net',
                  partialConfigs: { info: partialInfo },
                })
                return [done, _void]
              },
            },
          }
        },
      }
    },
  }
}
