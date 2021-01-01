import { ContentGraphEngine } from '../../types'
import { resolvers } from './graphqlResolvers'

export const arangoContentGraphEngine: Promise<ContentGraphEngine> = resolvers.then(
  (graphQLResolvers) => {
    const engine: ContentGraphEngine = {
      graphQLResolvers,
    }
    return engine
  }
)
