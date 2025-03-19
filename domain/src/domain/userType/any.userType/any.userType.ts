import { moodlenet } from './moodlenet.context/moodlenet.context'
import { system } from './system.context/system.context'

export interface Any {
  system: system
  moodlenet: moodlenet
}

export type any__ = moo.def.userType<moo<Any>>

export const any__: moo.def.gate.provider.userType<any__> = {
  system,
  moodlenet,
}
