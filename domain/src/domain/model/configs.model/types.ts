export type modelUpgradeData = {
  previous: string
  current: string
  date: string
  meta: unknown
}

export type allModuleConfigs = {
  [_modelName in Exclude<moo.modelName, 'configs'>]: moo.Models[_modelName][moo.tags.configs]
}
