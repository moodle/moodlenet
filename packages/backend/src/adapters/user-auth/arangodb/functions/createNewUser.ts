import { Role } from '../../../../lib/auth/types'
import { EmailAddr } from '../../../../lib/emailSender/types'
import { aqlstr } from '../../../../lib/helpers/arango'
import { ActiveUser, USER, UserStatus } from '../types'
import { isEmailInUseQ } from './isEmailInUse'
import { isUsernameInUseQ } from './isUsernameInUse'

export const createNewUserQ = ({
  email,
  password,
  username,
  role,
}: {
  email: EmailAddr
  username: string
  password: string
  role: Role
}) => {
  const document: ActiveUser = {
    _id: undefined as never,
    createdAt: undefined as never,
    updatedAt: undefined as never,
    status: UserStatus.Active,
    email,
    firstActivationToken: 'no-token',
    changeEmailRequest: null,
    password,
    username,
    role,
  }
  return `
  
    LET emailInUse = (${isEmailInUseQ({ email })})[0]
    LET usernameInUse = (${isUsernameInUseQ({ username })})[0]
  
  FOR user IN ${USER}
    
    FILTER !usernameInUse && !emailInUse
    
    LIMIT 1
      
    INSERT MERGE(
      ${aqlstr(document)},
      { 
        createdAt: DATE_NOW(),
        updatedAt: DATE_NOW()
      } 
    )
    INTO ${USER}
    RETURN NEW
  `
}
