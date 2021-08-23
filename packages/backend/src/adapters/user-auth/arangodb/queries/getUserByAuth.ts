import { ActiveUser, Status } from '@moodlenet/common/lib/user-auth/types'
import { aq, aqlstr } from '../../../../lib/helpers/arango/query'
import { USER } from '../types'

export const getActiveUserByAuthIdQ = ({ authId }: Pick<ActiveUser, 'authId'>) => {
  const activeStatus: Status = 'Active'
  return aq<ActiveUser>(`
    FOR user IN ${USER}
    FILTER user.authId == ${aqlstr(authId)} && user.status == ${aqlstr(activeStatus)}
    LIMIT 1
    RETURN user
  `)
}
