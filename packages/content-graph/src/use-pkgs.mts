import arangoApiRef from '@moodlenet/arangodb'
import authMngApiRef from '@moodlenet/authentication-manager'
import { useApis } from '@moodlenet/core'
import kvsApiRef from '@moodlenet/key-value-store'
import { ContentGraphKVStore } from './types.mjs'

export const arangoApis = useApis(import.meta, arangoApiRef)
export const authMngApis = useApis(import.meta, authMngApiRef)
export const kvStoreApis = useApis(import.meta, kvsApiRef)
export const kvStore = await kvStoreApis('getStore')<ContentGraphKVStore>()
