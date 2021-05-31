import { Database } from 'arangojs'
import { getOneResult } from '../../../../lib/helpers/arango'
import { NewUserConfirmAdapter, SignUpAdapter } from '../../../../ports/user-auth/new-user'
import { activateNewUserQ } from '../functions/activateNewUser'
import { isUsernameInUseQ } from '../functions/isUsernameInUse'
import { newUserRequestInsertQ } from '../functions/newUserRequest'
import { ActiveUser, WaitingFirstActivationUser } from '../types'
export const storeNewSignupRequest = (db: Database): Pick<SignUpAdapter, 'storeNewSignupRequest'> => ({
  storeNewSignupRequest: async ({ email, token }) => {
    const insertQ = newUserRequestInsertQ({ email, token })
    const newWaitingFirstActivationUser = (await getOneResult(insertQ, db)) as WaitingFirstActivationUser | null
    if (!newWaitingFirstActivationUser) {
      return 'email not available'
    }
    return // newWaitingFirstActivationUser
  },
})

export const activateNewUser = (db: Database): Pick<NewUserConfirmAdapter, 'activateUser'> => ({
  activateUser: async ({ password, token, username }) => {
    const userNameInUseQ = isUsernameInUseQ({ username })
    const userNameInUse = (await getOneResult(userNameInUseQ, db)) as true | null
    if (userNameInUse) {
      return 'username not available'
    }

    const activateQ = activateNewUserQ({ password, token, username })
    // Queries should be typed kinda  `type QueryType<T> = string & T`
    // so, `getOneResult` returns correct type
    const activeUser = (await getOneResult(activateQ, db)) as ActiveUser | null
    if (!activeUser) {
      return 'not found'
    }
    return activeUser
  },
})
