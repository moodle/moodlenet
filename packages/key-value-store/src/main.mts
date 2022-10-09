import { connectPkg } from '@moodlenet/core'
import apis from './apis.mjs'
export * from './types.js'

const connection = await connectPkg(import.meta, { apis })
export default connection
