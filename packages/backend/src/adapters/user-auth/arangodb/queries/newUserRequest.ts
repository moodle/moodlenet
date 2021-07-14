import { aqlstr } from '../../../../lib/helpers/arango'
import { USER, UserStatus, WaitingFirstActivationUser } from '../types'
import { isEmailInUseQ } from './isEmailInUse'
export const newUserRequestInsertQ = ({ email, token }: { email: string; token: string }) => {
  const document: WaitingFirstActivationUser = {
    _id: undefined as never,
    createdAt: undefined as never,
    updatedAt: undefined as never,
    status: UserStatus.WaitingFirstActivation,
    email,
    firstActivationToken: token,
  }

  return `
    LET emailInUse = (${isEmailInUseQ({ email })})[0]
    
    FILTER !emailInUse

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
