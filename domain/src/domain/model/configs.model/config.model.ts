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
  model: {
    [model_name in keyof moo.Models]: moo.model.op.atom<moo.Models[model_name][moo.tags.configs]>
  }
  allConfigs: moo.model.op<['query', void, allModuleConfigs]>
  latestModelUpgrade: {
    get: moo.model.op<['query', void, null | modelUpgradeData]>
    save: moo.model.op<['sync', modelUpgradeData, void]>
  }
}

