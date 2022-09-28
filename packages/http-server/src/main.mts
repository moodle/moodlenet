import { pkgApis } from '@moodlenet/core'
import apis from './apis.mjs'

// export * from './ext-ports-app/pub-lib.mjs'
export * from './types.mjs'

const apisRef = await pkgApis(import.meta, apis)

export default apisRef
