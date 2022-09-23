import arangoPkgRef from '@moodlenet/arangodb'
import { connect, pkgApis } from '@moodlenet/core'
import cryptoPkgRef from '@moodlenet/crypto'
import apis from './apis.mjs'

export * from './types.mjs'

const connection = await connect(import.meta, apis)

export default connection

export const arangoPkgApis = pkgApis(import.meta, arangoPkgRef)
export const cryptoPkgApis = pkgApis(import.meta, cryptoPkgRef)

await arangoPkgApis('ensureCollections')({})({ defs: { User: { kind: 'node' } } })

export const env = getEnv({})
function getEnv(_: any): Env {
  const rootPassword = typeof _?.rootPassword === 'string' ? String(_.rootPassword) : undefined
  return {
    rootPassword,
  }
}
export type Env = { rootPassword?: string }
