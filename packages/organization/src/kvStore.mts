import kvStoreFactory from '@moodlenet/key-value-store'
import shell from './shell.mjs'
import { KeyValueStoreData } from './types.mjs'

export default await kvStoreFactory<KeyValueStoreData>(shell)
