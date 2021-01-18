import { CollectionContainsResourceEdge } from '../../../glyph'
import { ContentGraphPersistence } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'
import { createRelationEdge } from '../ContentGraph.persistence.arango.queries'

export const createCollectionContainsResource = DBReady.then(
  ({
    db,
  }): ContentGraphPersistence['createCollectionContainsResource'] => async ({
    collectionId,
    collectionOwnerId,
    resourceId,
  }) => {
    return createRelationEdge<CollectionContainsResourceEdge>({
      _from: collectionId,
      _to: resourceId,
      data: { __typename: 'CollectionContainsResource' },
      db,
      edgeCollectionName: 'Contains',
      graphName: 'Contains',
    })
  }
)
