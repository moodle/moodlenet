import { coreExtId } from './main/pkgJson'
import { CoreExt, Ext } from './types'
export * from './core-lib'
export * from './main'
export * from './types'

export const coreExtDef: Omit<Ext<CoreExt>, 'enable'> = {
  id: coreExtId,
  displayName: 'Core',
  description: 'The kernel of MoodleNet',
  requires: [],
}

export default {
  exts: [coreExtDef],
}
