import arangoPkgRef from '@moodlenet/arangodb'
import authMngPkgRef from '@moodlenet/authentication-manager'
import graphPkgRef from '@moodlenet/content-graph'
import { useApis } from '@moodlenet/core'
import cryptoPkgRef from '@moodlenet/crypto'
import emailSrvPkgRef from '@moodlenet/email-service'
import httpPkgRef from '@moodlenet/http-server'
import reactAppPkgRef from '@moodlenet/react-app'
import webUserPkgRef from '@moodlenet/web-user'

export const arangoPkgApis = await useApis(import.meta, arangoPkgRef)
export const cryptoPkgApis = await useApis(import.meta, cryptoPkgRef)
export const authMngPkgApis = await useApis(import.meta, authMngPkgRef)
export const graphPkgApis = await useApis(import.meta, graphPkgRef)
export const emailSrvPkgApis = await useApis(import.meta, emailSrvPkgRef)
export const httpPkgApis = await useApis(import.meta, httpPkgRef)
export const reactAppPkgApis = await useApis(import.meta, reactAppPkgRef)
export const webUserPkgApis = await useApis(import.meta, webUserPkgRef)

await arangoPkgApis('ensureCollections')({ defs: { User: { kind: 'node' } } })
