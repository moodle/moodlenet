import { Resolvers } from '../ContentGraph.graphql.gen'

export interface ContentGraphPersistence {
  graphQLTypeResolvers: Omit<Resolvers, 'Mutation'>
  //config():Promise<Config>
}
