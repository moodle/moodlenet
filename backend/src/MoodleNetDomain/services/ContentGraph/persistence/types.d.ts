import { Resolvers } from '../graphql/ContentGraph.graphql.gen'

export interface ContentGraphEngine {
  graphQLResolvers: Resolvers
  //config():Promise<Config>
}
