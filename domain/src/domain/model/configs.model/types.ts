import { any_, d_u } from '@moodle/lib-types'

export type modelUpgradeData = {
  previous: string
  current: string
  date: string
  meta: any_
}

export type allModuleConfigs = d_u<
  {
    [_modelName in Exclude<moo.modelName, 'configs'>]: { configs: moo.Models[_modelName][moo.configs] }
  },
  'modelName'
>
