import { GraphQLApi } from '../../MoodleNetGraphQL'
import { CreateCollectionContainsResourceApi } from './apis/ContentGraph.Contains.CreateCollectionContainsResource'
import { CreateUserFollowsUserApi } from './apis/ContentGraph.Follows.CreateUserFollowsUser'
import { UserCreateForNewAccountApi } from './apis/ContentGraph.User.CreateForNewAccount.api'

export type ContentGraph = {
  GQL: GraphQLApi
  User: {
    CreateForNewAccount: UserCreateForNewAccountApi
  }
  Follows: {
    CreateUserFollowsUser: CreateUserFollowsUserApi
  }
  Contains: {
    CreateCollectionContainsResource: CreateCollectionContainsResourceApi
  }
}
