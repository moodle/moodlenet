import { Database } from 'arangojs'
import { EdgeType } from 'my-moodlenet-common/lib/graphql/types.graphql.gen'
import { ensureEdgeIndexes_0_0_3 } from './ensureEdgeIndexes0_0_3'

export const createBookmarkedEdgeCollections = async ({ db }: { db: Database }) => {
  console.log(`creating "Bookmarked" edge collection`)
  const edgeCollName: EdgeType = 'Bookmarked'
  let edgeCollection = await db.collection(edgeCollName)
  if (!(await edgeCollection.exists())) {
    edgeCollection = await db.createEdgeCollection(edgeCollName)
  }
  await ensureEdgeIndexes_0_0_3(edgeCollection)
}
