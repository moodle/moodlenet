import { serializable } from '@moodle/lib-types'

export type modelUpgradeData = {
  previous: string
  current: string
  date: string
  meta: serializable
}

export type allModuleConfigs = {
  [_modelName in Exclude<moo.modelName, 'configs'>]: moo.Models[_modelName][moo.configs]
}
