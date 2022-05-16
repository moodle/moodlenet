import { edgeTypes } from '@moodlenet/common/dist/content-graph/types/edge'
import { nodeTypes } from '@moodlenet/common/dist/content-graph/types/node'
import { Database } from 'arangojs'
import { ensureEdgeIndexes } from './ensureEdgeIndexes'
import { ensureNodeIndexes } from './ensureNodeIndexes'

export const createDBCollections = async ({ db }: { db: Database }) => {
  console.log(`creating node collections`)
  await Promise.all(
    nodeTypes.map(async nodeCollName => {
      const collection = await db.createCollection(nodeCollName)
      console.log(`created node collection ${nodeCollName}`)
      await ensureNodeIndexes(collection, nodeCollName)

      return collection
    }),
  )
  console.log(`creating edge collections`)
  await Promise.all(
    edgeTypes.map(async edgeCollName => {
      console.log(`creating edge collection ${edgeCollName}`)
      const edgeCollection = await db.createEdgeCollection(edgeCollName)
      await ensureEdgeIndexes(edgeCollection)
      return edgeCollection
    }),
  )
}
