import { pkgConnection } from '@moodlenet/core'
import httpSrvPkgRef from '@moodlenet/http-server'
import kvsPkgRef from '@moodlenet/key-value-store'
import { AppearanceData } from '../common/types.mjs'

export type KeyValueData = { appearanceData: AppearanceData }
export const kvsPkg = await pkgConnection(import.meta, kvsPkgRef)
export const kvStore = await kvsPkg.api('getStore')<KeyValueData>()

export const httpSrvPkg = await pkgConnection(import.meta, httpSrvPkgRef)
