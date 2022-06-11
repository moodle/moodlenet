import { resolve } from 'path'
import { splitExtId } from '../core-lib'
import { CoreExt, ExtId, PkgInfo } from '../types'

// type Env = {
// }
// function getEnv(rawExtEnv: RawExtEnv): Env {
//   return rawExtEnv as any //implement checks
// }
export const pkgJson = require(resolve(__dirname, '..', '..', 'package.json'))
export const pkgInfo: PkgInfo = { name: pkgJson.name, version: pkgJson.version }
export const coreExtId: ExtId<CoreExt> = 'moodlenet-core@0.1.10'
export const { extName: coreExtName, version: coreVersion } = splitExtId(coreExtId)
