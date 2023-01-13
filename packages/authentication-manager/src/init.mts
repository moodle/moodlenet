import { ensureCollections } from '@moodlenet/arangodb'
import shell from './shell.mjs'

export * from './pub-lib.mjs'
export * from './types.mjs'

await shell.initiateCall(() => ensureCollections({ defs: { User: { kind: 'node' } } }))
