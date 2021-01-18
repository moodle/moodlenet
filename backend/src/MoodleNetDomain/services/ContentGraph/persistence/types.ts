import { CreateCollectionContainsResourcePersistence } from '../apis/ContentGraph.Contains.CreateCollectionContainsResource'
import { CreateUserFollowsUserPersistence } from '../apis/ContentGraph.Follows.CreateUserFollowsUser'
import { CreateUserPersistence } from '../apis/ContentGraph.User.CreateForNewAccount.api'
import { Resolvers } from '../ContentGraph.graphql.gen'

export interface ContentGraphPersistence {
  graphQLTypeResolvers: Omit<Resolvers, 'Mutation'>
  createUser: CreateUserPersistence
  createUserFollowsUser: CreateUserFollowsUserPersistence
  createCollectionContainsResource: CreateCollectionContainsResourcePersistence
  //config():Promise<Config>
}
export enum CreateRelationEdgeErrorMsg {
  NO_SELF = 'no-self',
  SOME_VERTEX_NOT_FOUND = 'some-vertex-not-found',
}
