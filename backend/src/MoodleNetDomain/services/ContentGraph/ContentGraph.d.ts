import { GraphQLApi } from '../../MoodleNetGraphQL'
import { UserCreateForNewAccountApi } from './apis/ContentGraph.User.CreateForNewAccount.api'

export type ContentGraph = {
  GQL: GraphQLApi
  User: {
    CreateForNewAccount: UserCreateForNewAccountApi
  }
}
