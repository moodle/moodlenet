import { ContentGraphPersistence } from '../../types'
import { getGraphQLTypeResolvers } from './graphqlTypeResolvers'

export const getArangoContentGraphEngine = async (): Promise<ContentGraphPersistence> => {
  const engine: ContentGraphPersistence = {
    graphQLTypeResolvers: await getGraphQLTypeResolvers(),
  }
  return engine
}
