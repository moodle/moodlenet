import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { _void } from '@moodle/lib-types'
import { dbStruct } from '../db-structure'
import { getModConfigs, updateDeepPartialModConfigs } from '../lib'

export function env_secondary_factory({ dbStruct }: { dbStruct: dbStruct }): secondaryProvider {
  return secondaryCtx => {
    const secondaryAdapter: secondaryAdapter = {
      env: {
        query: {
          async modConfigs({ mod }) {
            const configs = await getModConfigs({
              moduleName: mod,
              dbStruct,
            })
            return configs
          },
        },
        service: {
          async updatePartialConfigs({ partialConfigs, mod }) {
            const result = await updateDeepPartialModConfigs({
              moduleName: mod,
              dbStruct,
              partialConfigs,
            })
            return [!!result, _void]
          },
        },
      },
    }
    return secondaryAdapter
  }
}
