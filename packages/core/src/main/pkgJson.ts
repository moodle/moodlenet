import { splitExtId } from '../core-lib'
import { CoreExt, ExtId } from '../types'

export const coreExtId: ExtId<CoreExt> = 'moodlenet-core@0.1.10'
export const { extName: coreExtName, version: coreVersion } = splitExtId(coreExtId)
