import kvStoreFactory from '@moodlenet/key-value-store/server'
import { shell } from './shell.mjs'
import { OpenIdKeyValueData } from './types/storeTypes.mjs'

export const kvStore = await kvStoreFactory<OpenIdKeyValueData>(shell)
