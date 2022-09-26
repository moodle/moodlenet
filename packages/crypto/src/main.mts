import { pkgApis } from '@moodlenet/core'
import apis from './apis.mjs'
import './init.mjs'
export * from './types.mjs'

export default await pkgApis(import.meta, apis)
