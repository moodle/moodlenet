import { configs } from '@moodle/domain/model'
import { any_, unsupportedProxyHandler } from '@moodle/lib-types'
import { dbStruct, modulesModelConfigData } from '../db-structure'
import { aql } from 'arangojs'

export function modelConfigs({ dbStruct }: { dbStruct: dbStruct }): moo.model.impl<configs.configsModel> {
  return {
    allConfigs: {
      $: {
        call: {
          exe: async () => {
            const allCursor = await dbStruct.appData.db.query<modulesModelConfigData>(
              aql`FOR doc IN ${dbStruct.appData.coll.modelConfig}
          RETURN doc`,
            )
            const all = await allCursor.all()
            const allConfigs = all.reduce((acc, { configs, modelName }) => ({ ...acc, [modelName]: configs }), {} as configs.allModuleConfigs)
            return allConfigs
          },
        },
      },
    },
    //TODO: try to make a well typed util for this kind of usecase (named map od)
    module: new Proxy(
      {},
      {
        ...unsupportedProxyHandler,
        get: <model_name extends Exclude<moo.modelName, 'configs'>>(_target: any_, modelName: model_name) => {
          const { _: impl }: moo.model.impl<{ _: moo.model.type.atom<'static', moo.Models[Exclude<moo.modelName, 'configs'>][moo.tags.configs]> }> = {
            _: {
              $: {
                put: {
                  exe: async ({ newData }) => {
                    const modConfigData: modulesModelConfigData = {
                      configs: newData as any_,
                      modelName: modelName as any_,
                    }
                    await dbStruct.appData.coll.modelConfig.save({ _key: modelName, ...modConfigData })
                    return 'done'
                  },
                },
                get: {
                  exe: async () => {
                    const doc = await dbStruct.appData.coll.modelConfig.document({ _key: modelName })
                    return doc.configs
                  },
                },
              },
            },
          }
          return impl
        },
      },
    ),
    latestModuleUpgrade: {
      get: {
        $: {
          call: {
            exe: async () => {
              const doc = await dbStruct.services.coll.modelUpgrade.document({ _key: 'latest' }, { graceful: true })
              if (!doc) return null
              return doc.data
            },
          },
        },
      },
      save: {
        $: {
          call: {
            exe: async modelUpgradeData => {
              await dbStruct.services.coll.modelUpgrade.saveAll(
                [
                  { _key: `${modelUpgradeData.previous}::${modelUpgradeData.current}`, data: modelUpgradeData },
                  { _key: 'latest', data: modelUpgradeData },
                ],
                { overwriteMode: 'replace', silent: true },
              )
            },
          },
        },
      },
    },
  }
}
