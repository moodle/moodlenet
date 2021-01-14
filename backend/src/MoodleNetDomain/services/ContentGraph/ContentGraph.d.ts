import { Api } from '../../../lib/domain/api/types'
import { LookupEventType } from '../../../lib/domain/event/types'
import { Maybe } from '../../../lib/helpers/types'
import { MoodleNetDomain } from '../../MoodleNetDomain'
import { GraphQLApi } from '../../MoodleNetGraphQL'
import { UserFollowsUserEdge, UserVertex } from './persistence/glyph'
import { CreateRelationEdgeErrorMsg } from './persistence/types'

export type ContentGraph = {
  GQL: GraphQLApi
  User: {
    Create_For_New_Account: Api<
      LookupEventType<
        MoodleNetDomain,
        'UserAccount.Register_New_Account.NewAccountActivated'
      >,
      { newUser: UserVertex | null }
    >
  }
  Follows: {
    Create_User_Follows_User: Api<
      { follower: string; followed: string },
      { edge: UserFollowsUserEdge | CreateRelationEdgeErrorMsg }
    >
  }
}
