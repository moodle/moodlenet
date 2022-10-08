import arangoPkgRef from '@moodlenet/arangodb'
import { useApis } from '@moodlenet/core'
import cryptoPkgRef from '@moodlenet/crypto'

export const arangoPkgApis = await useApis(import.meta, arangoPkgRef)
export const cryptoPkgApis = await useApis(import.meta, cryptoPkgRef)
await arangoPkgApis('ensureCollections')({ defs: { User: { kind: 'node' } } })
