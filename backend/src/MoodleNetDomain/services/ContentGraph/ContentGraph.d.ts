import { Api } from '../../../lib/domain/api/types'
import { LookupEventType } from '../../../lib/domain/event/types'
import { MoodleNetDomain } from '../../MoodleNetDomain'
import { GraphQLApi } from '../../MoodleNetGraphQL'
import { UserVertex } from './persistence/glyph'

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
}
