import { coreExtName, coreExtVersion } from './main/pkgJson'
import { CoreExt, Ext } from './types'
export * from './core-lib'
export * from './main'
export * from './types'

export const coreExtDef: Omit<Ext<CoreExt>, 'connect'> = {
  name: coreExtName,
  version: coreExtVersion,
  requires: [],
}

export default coreExtDef
