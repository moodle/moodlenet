import { Resolvers } from '../ContentGraph.graphql.gen'

export interface ContentGraphEngine {
  graphQLResolvers: Resolvers
  //config():Promise<Config>
}
