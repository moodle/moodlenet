import { UserSession } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { ActiveUser } from './types'

export const userSessionByActiveUser = ({ activeUser }: { activeUser: ActiveUser }): UserSession => ({
  __typename: 'UserSession',
  userId: activeUser._id,
  changeEmailRequest: activeUser.changeEmailRequest?.email ?? null,
  email: activeUser.email,
  username: activeUser.username,
  profileId: activeUser.profileId,
})
