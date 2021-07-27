import { User } from '@moodlenet/common/lib/user-auth/types'
import { aq, aqlstr } from '../../../../lib/helpers/arango/query'
import { USER } from '../types'

export const isEmailInUseQ = ({ email }: Pick<User, 'email'>) =>
  aq<true>(`
    FOR user IN ${USER}
    FILTER user.email == ${aqlstr(email)}
    LIMIT 1
    RETURN true
`)
