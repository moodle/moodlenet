import { connectPkg } from '@moodlenet/core'
import apis from './apis.mjs'

// export * from './ext-ports-app/pub-lib.mjs'
export * from './types.mjs'

const connection = await connectPkg(import.meta, { apis })
export default connection
