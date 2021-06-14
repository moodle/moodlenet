import { UserSession } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { ActiveUser } from './types'

export const userSessionByActiveUser = ({ activeUser }: { activeUser: ActiveUser }): UserSession => ({
  __typename: 'UserSession',
  username: activeUser.username,
  role: activeUser.role,
})
