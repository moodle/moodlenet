import { CollectionDefsMap } from '@moodlenet/arangodb/src'

export type ContentGraphCollections = CollectionDefsMap<{
  Created: ['edge', { a: string }]
  Updated: ['edge', {}]
  Deleted: ['edge', {}]
}>
