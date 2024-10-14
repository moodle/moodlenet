import { secondaryAdapter, secondaryBootstrap } from '@moodle/domain'
import { _void } from '@moodle/lib-types'
import { db_struct } from '../db-structure'
import { getModConfigs, updateDeepPartialModConfigs } from '../lib'

export function env_secondary_factory({ db_struct }: { db_struct: db_struct }): secondaryBootstrap {
  return bootstrapCtx => {
    return secondaryCtx => {
      const secondaryAdapter: secondaryAdapter = {
        env: {
          query: {
            async modConfigs({ mod }) {
              const configs = await getModConfigs({
                moduleName: mod,
                db_struct,
              })
              return configs
            },
          },
          service: {
            async updatePartialConfigs({ partialConfigs, mod }) {
              const result = await updateDeepPartialModConfigs({
                moduleName: mod,
                db_struct,
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
}
