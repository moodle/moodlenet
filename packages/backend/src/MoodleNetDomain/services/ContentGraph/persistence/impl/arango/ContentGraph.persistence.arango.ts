import { ContentGraphPersistence } from '../../types'
import { createEdge } from './apis/createEdge'
import { createNode } from './apis/createNode'
import { findNode, findNodeWithPolicy } from './apis/findNode'
import { getRelationCount } from './apis/getRelationCount'
import { globalSearch } from './apis/globalSearch'
import { traverseEdges } from './apis/traverseEdges'

// import { getGraphQLTypeResolvers } from './graphqlTypeResolvers'

export const getArangoContentGraphPersistence = (): ContentGraphPersistence => {
  const persistence: ContentGraphPersistence = {
    globalSearch,
    findNode,
    findNodeWithPolicy,
    traverseEdges,
    createNode,
    createEdge,
    getRelationCount,
    // graphQLTypeResolvers: getGraphQLTypeResolvers(),
  }
  return persistence
}
