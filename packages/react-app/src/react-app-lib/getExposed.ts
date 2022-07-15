import { ExtDef } from '@moodlenet/core'
import exp from 'ext-exposed-modules'
import { ExtModule } from '../types'
console.log('**')

export function getExposed<ExtMod extends ExtModule<ExtDef, any> = ExtModule<ExtDef, any>>(name: ExtMod[0]): ExtMod[1] {
  console.log({ exp, name })
  return exp[name]?.lib
}
