import { ExtDef } from '@moodlenet/core'
import { ExtModule } from '../types'
import exp from './exposedExtModules'
console.log('**')

export function getExposed<ExtMod extends ExtModule<ExtDef, any> = ExtModule<ExtDef, any>>(name: ExtMod[0]): ExtMod[1] {
  console.log({ exp, name })
  return exp[name]?.lib
}
