import { connectPkg } from '@moodlenet/core'
import apis from './apis.mjs'
import { kvStore } from './use-pkg-apis.mjs'
export * from './types.mjs'

const connection = await connectPkg(import.meta, { apis })
export default connection

if (!(await kvStore.get('mailerCfg', '')).value) {
  kvStore.set('mailerCfg', '', {
    defaultFrom: 'noreply',
    defaultReplyTo: 'noreply',
  })
}
