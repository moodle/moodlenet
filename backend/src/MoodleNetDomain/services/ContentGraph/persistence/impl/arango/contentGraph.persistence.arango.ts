import { ContentGraphPersistence } from '../../types'
import { resolvers } from './graphqlResolvers'

export const arangoContentGraphEngine: Promise<ContentGraphPersistence> = resolvers.then(
  (graphQLResolvers) => {
    const engine: ContentGraphPersistence = {
      graphQLTypeResolvers: graphQLResolvers,
    }
    return engine
  }
)
