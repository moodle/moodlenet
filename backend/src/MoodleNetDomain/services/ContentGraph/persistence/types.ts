import { CreateUserFollowsUserPersistence } from '../apis/ContentGraph.Follows.Create_User_Follows_User'
import { CreateUserPersistence } from '../apis/ContentGraph.User.Create_For_New_Account.api'
import { Resolvers } from '../ContentGraph.graphql.gen'

export interface ContentGraphPersistence {
  graphQLTypeResolvers: Omit<Resolvers, 'Mutation'>
  createUser: CreateUserPersistence
  createUserFollowsUser: CreateUserFollowsUserPersistence
  //config():Promise<Config>
}
export enum CreateRelationEdgeErrorMsg {
  NO_SELF = 'no-self',
  SOME_VERTEX_NOT_FOUND = 'some-vertex-not-found',
}
