import { DistOmit } from '@moodlenet/common/dist/utils/types'
import { aq, aqlstr } from '../../../../lib/helpers/arango/query'
import { User } from '../../../../ports/user-auth/types'
import { USER } from '../types'
import { isEmailInUseQ } from './isEmailInUse'

export type CreateNewUserQArg<U extends User> = DistOmit<U, 'id' | 'createdAt' | 'updatedAt'>
export const createNewUserQ = <U extends User>(user: CreateNewUserQArg<U>) => {
  return aq<U>(`
    LET emailInUse = (${isEmailInUseQ({ email: user.email })})[0]
    
    FILTER !emailInUse
    
    LIMIT 1
      
    INSERT MERGE(
      ${aqlstr(user)},
      { 
        createdAt: DATE_NOW(),
        updatedAt: DATE_NOW()
      } 
    )

    INTO ${USER}
    RETURN MERGE( { id:NEW._key } , NEW )
  `)
}
