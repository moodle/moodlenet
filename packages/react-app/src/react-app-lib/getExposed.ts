import { ExtDef } from '@moodlenet/core'
import exp from 'ext-exposed-modules'
import { ExtModule } from '../types'

export function getExposed<ExtMod extends ExtModule<ExtDef, any> = ExtModule<ExtDef, any>>(name: ExtMod[0]): ExtMod[1] {
  console.log({ exp, name, x: exp[name], lib: exp[name]?.lib })
  return exp[name]?.lib
}
