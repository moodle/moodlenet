import { ActiveUser, Status } from '@moodlenet/common/lib/user-auth/types'
import { aq, aqlstr } from '../../../../lib/helpers/arango/query'
import { USER } from '../types'

export const activateNewUserQ = ({ token, password }: { token: string; password: string }) => {
  const activeUserPatch: Pick<ActiveUser, 'password' | 'status'> = {
    password,
    status: 'Active',
  }
  const WaitingFirstActivationStatus: Status = 'WaitingFirstActivation'
  return aq<ActiveUser>(`
    FOR user IN ${USER}

      FILTER user.firstActivationToken == ${aqlstr(token)}
        && user.status == ${aqlstr(WaitingFirstActivationStatus)}

      LIMIT 1
      
      let activeUser = MERGE( user, ${aqlstr(activeUserPatch)}, {
        updatedAt: DATE_NOW()
      } )

     // UNSET( activeUser, "firstActivationToken" )

      UPDATE activeUser IN ${USER}

    RETURN NEW
  `)
}
