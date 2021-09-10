import { aq, aqlstr } from '../../../../lib/helpers/arango/query'
import { ActiveUser, Status } from '../../../../ports/user-auth/types'
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

export const updateActiveUserPasswordByAuthIdQ = ({ authId, password }: Pick<ActiveUser, 'authId' | 'password'>) => {
  const activeStatus: Status = 'Active'
  const patch: Pick<ActiveUser, 'password'> = {
    password,
  }
  return aq<ActiveUser>(`
    FOR user IN ${USER}
    FILTER user.authId == ${aqlstr(authId)} && user.status == ${aqlstr(activeStatus)}
    LIMIT 1
    UPDATE user with ${aqlstr(patch)} IN ${USER}
    RETURN $NEW 
  `)
}
