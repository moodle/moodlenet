import { connectPkg } from '@moodlenet/core'
import apis from './server/apis.mjs'

const myPkgId = await connectPkg(import.meta, { apis })
export default myPkgId
