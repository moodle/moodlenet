import { Database } from 'arangojs'

const nodes = ['Profile', 'Collection', 'Resource', 'IscedField', 'Organization']
const edges = ['Created', 'Features', 'Follows', 'Pinned']

export const createDBCollections = async ({ db }: { db: Database }) => {
  await nodes.map(async nodeCollName => {
    console.log(`creating node collection ${nodeCollName}`)
    const collection = await db.createCollection(nodeCollName)
    return collection
  })
  await edges.map(async edgeCollName => {
    console.log(`creating edge collection ${edgeCollName}`)
    const edgeCollection = await db.createEdgeCollection(edgeCollName)
    return edgeCollection
  })
}
