import getStore from '@moodlenet/key-value-store'
import shell from './shell.mjs'
import { KVStoreTypes } from './types.mjs'

export default await getStore<KVStoreTypes>(shell)
