import { aqlstr } from '../../../../lib/helpers/arango'
import { USER, UserStatus } from '../types'

export const getActiveUserByUsernameQ = ({ username }: { username: string }) => `
    FOR user IN ${USER}
    FILTER user.username == ${aqlstr(username)}
          && user.status == ${aqlstr(UserStatus.Active)}
    LIMIT 1
    RETURN user
  `
