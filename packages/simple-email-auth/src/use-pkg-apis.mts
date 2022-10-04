import arangoPkgRef from '@moodlenet/arangodb'
import authMngPkgRef from '@moodlenet/authentication-manager'
import graphPkgRef from '@moodlenet/content-graph'
import { useApis } from '@moodlenet/core'
import cryptoPkgRef from '@moodlenet/crypto'
import emailSrvPkgRef from '@moodlenet/email-service'
import httpPkgRef from '@moodlenet/http-server'
import reactAppPkgRef from '@moodlenet/react-app'
import webUserPkgRef from '@moodlenet/web-user'

export const arangoPkgApis = useApis(import.meta, arangoPkgRef)
export const cryptoPkgApis = useApis(import.meta, cryptoPkgRef)
export const authMngPkgApis = useApis(import.meta, authMngPkgRef)
export const graphPkgApis = useApis(import.meta, graphPkgRef)
export const emailSrvPkgApis = useApis(import.meta, emailSrvPkgRef)
export const httpPkgApis = useApis(import.meta, httpPkgRef)
export const reactAppPkgApis = useApis(import.meta, reactAppPkgRef)
export const webUserPkgApis = useApis(import.meta, webUserPkgRef)

await arangoPkgApis('ensureCollections')({ defs: { User: { kind: 'node' } } })
