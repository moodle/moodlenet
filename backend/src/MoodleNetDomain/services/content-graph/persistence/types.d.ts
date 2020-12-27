import { Resolvers } from '../graphql/content-graph.graphql.gen'

export interface ContentGraphEngine {
  graphQLResolvers: Resolvers
  //config():Promise<Config>
}
