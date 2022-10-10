import { pkgConnection } from '@moodlenet/core'
import httpSrvPkgRef from '@moodlenet/http-server'
import kvsPkgRef from '@moodlenet/key-value-store'
import { AppearanceData } from './types/data.mjs'

export type KeyValueData = { appearanceData: AppearanceData }
export const kvsPkgApis = await pkgConnection(import.meta, kvsPkgRef)
export const kvStore = await kvsPkgApis('getStore')<KeyValueData>()

export const httpSrvPkgApis = await pkgConnection(import.meta, httpSrvPkgRef)
