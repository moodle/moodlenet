import arangoPkgRef from '../../arangodb/dist/init.mjs'
import { pkgConnection } from '@moodlenet/core'
import cryptoPkgRef from '@moodlenet/crypto'

export const arangoPkg = await pkgConnection(import.meta, arangoPkgRef)
export const cryptoPkg = await pkgConnection(import.meta, cryptoPkgRef)
await arangoPkg.api('ensureCollections')({ defs: { User: { kind: 'node' } } })
