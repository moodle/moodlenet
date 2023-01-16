import getStore from '@moodlenet/key-value-store'
import shell from './shell.mjs'
import { KeyValueStoreData } from './types.mjs'

export default await getStore<KeyValueStoreData>(shell)
