/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { allModuleConfigs, modelUpgradeData } from './types'

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace moo {
    interface Models {
      configs: configs_
    }
  }
}

export type configs_ = moo.model<configsModel>

export type configsModel = {
  [moo.configs]: never
  module: {
    [model_name in Exclude<moo.modelName, 'configs'>]: moo.model.type.staticData<moo.Models[model_name][moo.configs]>
  }
  allConfigs: moo.model.type.endpoint<['query', void, allModuleConfigs]>
  latestModuleUpgrade: {
    get: moo.model.type.endpoint<['query', void, null | modelUpgradeData]>
    save: moo.model.type.endpoint<['sync', modelUpgradeData, void]>
  }
}
