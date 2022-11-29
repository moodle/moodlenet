import arangoPkgRef from '@moodlenet/arangodb'
import { pkgConnection } from '@moodlenet/core'
import cryptoPkgRef from '@moodlenet/crypto'

export const arangoPkg = await pkgConnection(import.meta, arangoPkgRef)
export const cryptoPkg = await pkgConnection(import.meta, cryptoPkgRef)
await arangoPkg.api('ensureCollections')({ defs: { User: { kind: 'node' } } })
