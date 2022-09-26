import { pkgApis } from '@moodlenet/core'
import apis from './apis.mjs'
import './init.mjs'

export * from './types.mjs'

const apisRef = await pkgApis(import.meta, apis)

export default apisRef
