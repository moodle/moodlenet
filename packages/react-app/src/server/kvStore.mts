import kvStoreFactory from '@moodlenet/key-value-store'
import { AppearanceData } from '../common/types.mjs'
import shell from './shell.mjs'

export type KeyValueData = { appearanceData: AppearanceData }

export default await kvStoreFactory<KeyValueData>(shell)
