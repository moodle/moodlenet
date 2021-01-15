import { GraphQLApi } from '../../MoodleNetGraphQL'
import { Create_User_Follows_User_Api } from './apis/ContentGraph.Follows.Create_User_Follows_User'
import { User_Create_For_New_Account_Api } from './apis/ContentGraph.User.Create_For_New_Account.api'

export type ContentGraph = {
  GQL: GraphQLApi
  User: {
    Create_For_New_Account: User_Create_For_New_Account_Api
  }
  Follows: {
    Create_User_Follows_User: Create_User_Follows_User_Api
  }
}
