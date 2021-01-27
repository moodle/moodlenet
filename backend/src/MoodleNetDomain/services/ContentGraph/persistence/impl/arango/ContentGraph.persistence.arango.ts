import { ContentGraphPersistence } from '../../types'
import { createUser } from './apis/createUser'
import { findNode, findNodeWithPolicy } from './apis/findNode'
import { traverseEdges } from './apis/traverseEdges'
// import { getGraphQLTypeResolvers } from './graphqlTypeResolvers'

export const getArangoContentGraphPersistence = (): ContentGraphPersistence => {
  const persistence: ContentGraphPersistence = {
    findNode,
    findNodeWithPolicy,
    createUser,
    traverseEdges,
    // graphQLTypeResolvers: getGraphQLTypeResolvers(),
  }
  return persistence
}
