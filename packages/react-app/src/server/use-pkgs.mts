import corePkgConn from '@moodlenet/core'
import { pkgConnection } from '@moodlenet/core'
import httpSrvPkgConn from '../../../http-server/dist/init.mjs'
import kvsPkgConn from '@moodlenet/key-value-store'
import { AppearanceData } from '../common/types.mjs'

export type KeyValueData = { appearanceData: AppearanceData }
export const kvsPkg = await pkgConnection(import.meta, kvsPkgConn)
export const corePkg = await pkgConnection(import.meta, corePkgConn)

export const kvStore = await kvsPkg.api('getStore')<KeyValueData>()

export const httpSrvPkg = await pkgConnection(import.meta, httpSrvPkgConn)
