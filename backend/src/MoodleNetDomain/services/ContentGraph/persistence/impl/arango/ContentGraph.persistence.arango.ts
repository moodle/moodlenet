import { ContentGraphPersistence } from '../../types'
import { createUser } from './apis/createUser'
import { findNode } from './apis/findNode'
import { getGraphQLTypeResolvers } from './graphqlTypeResolvers'

export const getArangoContentGraphPersistence = (): ContentGraphPersistence => {
  const persistence: ContentGraphPersistence = {
    findNode: findNode,
    createUser: createUser,
    graphQLTypeResolvers: getGraphQLTypeResolvers(),
  }
  return persistence
}
