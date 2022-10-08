import arangoApiRef from '@moodlenet/arangodb'
import authMngApiRef from '@moodlenet/authentication-manager'
import { useApis } from '@moodlenet/core'
import kvsApiRef from '@moodlenet/key-value-store'
import { ContentGraphKVStore } from './types.mjs'

export const arangoApis = await useApis(import.meta, arangoApiRef)
export const authMngApis = await useApis(import.meta, authMngApiRef)
export const kvStoreApis = await useApis(import.meta, kvsApiRef)
export const kvStore = await kvStoreApis('getStore')<ContentGraphKVStore>()
