import arangoPkgRef from '../../arangodb/dist/init.mjs'
import authMngPkgRef from '../../authentication-manager/dist/init.mjs'
import graphPkgRef from '../../content-graph/dist/init.mjs'
import { pkgConnection } from '@moodlenet/core'
import cryptoPkgRef from '@moodlenet/crypto'
import emailSrvPkgRef from '@moodlenet/email-service'
import httpPkgRef from '../../http-server/dist/init.mjs'
import reactAppPkgRef from '../../react-app/dist/root-export.mjs'
import webUserPkgRef from '../../web-user/dist/init.mjs'

export const arangoPkg = await pkgConnection(import.meta, arangoPkgRef)
export const cryptoPkg = await pkgConnection(import.meta, cryptoPkgRef)
export const authMngPkg = await pkgConnection(import.meta, authMngPkgRef)
export const graphPkg = await pkgConnection(import.meta, graphPkgRef)
export const emailSrvPkg = await pkgConnection(import.meta, emailSrvPkgRef)
export const httpPkg = await pkgConnection(import.meta, httpPkgRef)
export const reactAppPkg = await pkgConnection(import.meta, reactAppPkgRef)
export const webUserPkg = await pkgConnection(import.meta, webUserPkgRef)

await arangoPkg.api('ensureCollections')({ defs: { User: { kind: 'node' } } })
