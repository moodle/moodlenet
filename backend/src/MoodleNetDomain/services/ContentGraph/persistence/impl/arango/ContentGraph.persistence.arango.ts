import { ContentGraphPersistence } from '../../types'
import { createCollectionContainsResource } from './apis/createCollectionContainsResource'
import { createUser } from './apis/createUser'
import { createUserFollowUser } from './apis/createUserFollowUser'
import { getGraphQLTypeResolvers } from './graphqlTypeResolvers'

export const getArangoContentGraphPersistence = async (): Promise<ContentGraphPersistence> => {
  const persistence: ContentGraphPersistence = {
    graphQLTypeResolvers: await getGraphQLTypeResolvers(),
    createUser: await createUser,
    createUserFollowsUser: await createUserFollowUser,
    createCollectionContainsResource: await createCollectionContainsResource,
  }
  return persistence
}
