import { ensureCollections } from '@moodlenet/arangodb'
import shell from './shell.mjs'

export * from './lib.mjs'
export * from './types.mjs'

await shell.call(ensureCollections)({ defs: { User: { kind: 'node' } } })
