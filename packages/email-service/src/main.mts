import { pkgApis } from '@moodlenet/core'
import apis from './apis.mjs'

const connection = await pkgApis(import.meta, apis)

export default connection
