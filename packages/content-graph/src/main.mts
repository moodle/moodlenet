import { connectPkg } from '@moodlenet/core'
import apis from './apis.mjs'
export * from '@moodlenet/arangodb/lib/types.mjs'
export * from './types.mjs'

const connection = await connectPkg(import.meta, { apis })
export default connection
