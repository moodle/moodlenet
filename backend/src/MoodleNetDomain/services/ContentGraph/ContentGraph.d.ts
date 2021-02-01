import { GraphQLApi } from '../../MoodleNetGraphQL'
import { UserCreateForNewAccountApiHandler } from './apis/ContentGraph.User.CreateForNewAccount.api'
import { NodeByIdApiHandler } from './apis/ContentGraph.Node.ById'

export type ContentGraph = {
  GQL: GraphQLApi
  User: {
    CreateForNewAccount: typeof UserCreateForNewAccountApiHandler
  }
  Node: {
    ById: typeof NodeByIdApiHandler
  }
}
