import { pkgApis } from '@moodlenet/core'
import apis from './apis.mjs'
export * from './types.js'

export default await pkgApis(import.meta, apis)
