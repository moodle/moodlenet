import { EdgeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Database } from 'arangojs'
import { ensureEdgeIndexes_0_0_2 } from './ensureEdgeIndexes0_0_2'

export const createLikeEdgeCollections = async ({ db }: { db: Database }) => {
  console.log(`creating "Likes" edge collection`)
  const edgeCollName: EdgeType = 'Likes'
  let edgeCollection = await db.collection(edgeCollName)
  if (!(await edgeCollection.exists())) {
    edgeCollection = await db.createEdgeCollection(edgeCollName)
  }
  await ensureEdgeIndexes_0_0_2(edgeCollection)
}
