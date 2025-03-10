/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { allModuleConfigs, modelUpgradeData } from './types'

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace moo {
    interface Models {
      configs: configs
    }
  }
}

export type configs = moo.model<configsModel>

export type configsModel = {
  [moo.tags.configs]: never
  module: {
    [model_name in Exclude<moo.modelName, 'configs'>]: moo.model.ops.atom<'static', moo.Models[model_name][moo.tags.configs]>
  }
  allConfigs: moo.model.ops.endpoint<['query', void, allModuleConfigs]>
  latestModuleUpgrade: {
    get: moo.model.ops.endpoint<['query', void, null | modelUpgradeData]>
    save: moo.model.ops.endpoint<['sync', modelUpgradeData, void]>
  }
}
