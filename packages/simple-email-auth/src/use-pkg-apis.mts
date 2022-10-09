import arangoPkgRef from '@moodlenet/arangodb'
import authMngPkgRef from '@moodlenet/authentication-manager'
import graphPkgRef from '@moodlenet/content-graph'
import { pkgConnection } from '@moodlenet/core'
import cryptoPkgRef from '@moodlenet/crypto'
import emailSrvPkgRef from '@moodlenet/email-service'
import httpPkgRef from '@moodlenet/http-server'
import reactAppPkgRef from '@moodlenet/react-app'
import webUserPkgRef from '@moodlenet/web-user'

export const arangoPkg = await pkgConnection(import.meta, arangoPkgRef)
export const cryptoPkg = await pkgConnection(import.meta, cryptoPkgRef)
export const authMngPkg = await pkgConnection(import.meta, authMngPkgRef)
export const graphPkg = await pkgConnection(import.meta, graphPkgRef)
export const emailSrvPkg = await pkgConnection(import.meta, emailSrvPkgRef)
export const httpPkg = await pkgConnection(import.meta, httpPkgRef)
export const reactAppPkg = await pkgConnection(import.meta, reactAppPkgRef)
export const webUserPkg = await pkgConnection(import.meta, webUserPkgRef)

await arangoPkg.api('ensureCollections')({ defs: { User: { kind: 'node' } } })
