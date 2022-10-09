import { connectPkg } from '@moodlenet/core'
import apis from './apis.mjs'
import './init.mjs'
export * from './types.mjs'

const connection = await connectPkg(import.meta, { apis })
export default connection
