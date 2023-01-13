import getStore from '@moodlenet/key-value-store'
import shell from './shell.mjs'
import { ContentGraphKVStore } from './types.mjs'

export default await getStore<ContentGraphKVStore>(shell)
