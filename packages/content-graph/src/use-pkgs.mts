import arangoApiRef from '@moodlenet/arangodb'
import authMngApiRef from '@moodlenet/authentication-manager'
import { pkgConnection } from '@moodlenet/core'
import kvsApiRef from '@moodlenet/key-value-store'
import { ContentGraphKVStore } from './types.mjs'

export const arangoPkg = await pkgConnection(import.meta, arangoApiRef)
export const authMngPkg = await pkgConnection(import.meta, authMngApiRef)
export const kvStorePkg = await pkgConnection(import.meta, kvsApiRef)
export const kvStore = await kvStorePkg.api('getStore')<ContentGraphKVStore>()
