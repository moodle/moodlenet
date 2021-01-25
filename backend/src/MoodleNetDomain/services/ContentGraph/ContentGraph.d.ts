import { GraphQLApi } from '../../MoodleNetGraphQL'
import { UserCreateForNewAccountApi } from './apis/ContentGraph.User.CreateForNewAccount.api'
import { UserByIdApi } from './apis/ContentGraph.User.ById'

export type ContentGraph = {
  GQL: GraphQLApi
  User: {
    CreateForNewAccount: UserCreateForNewAccountApi
    ById: UserByIdApi
  }
}
