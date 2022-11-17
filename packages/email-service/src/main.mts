import { connectPkg } from '@moodlenet/core'
import apis from './apis.mjs'

const connection = await connectPkg(import.meta, { apis })
export default connection

console.log('*'.repeat(300))
