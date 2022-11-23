import { connectPkg } from '@moodlenet/core'
import apis from './apis.mjs'
console.log({ ara: import.meta })
export * from './types.mjs'

const connection = await connectPkg(import.meta, { apis })
export default connection
