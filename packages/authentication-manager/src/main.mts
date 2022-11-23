import { connectPkg } from '@moodlenet/core'
import apis from './apis.mjs'
console.log({ cg: import.meta })

export * from './pub-lib.mjs'
export * from './types.mjs'

const connection = await connectPkg(import.meta, { apis })
export default connection
