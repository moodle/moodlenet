import { getOneResult } from '../../../../lib/helpers/arango'
import { CreateNewUserAdapter, NewUserConfirmAdapter, SignUpAdapter } from '../../../../ports/user-auth/new-user'
import { activateNewUserQ } from '../functions/activateNewUser'
import { createNewUserQ } from '../functions/createNewUser'
import { isEmailInUseQ } from '../functions/isEmailInUse'
import { isUsernameInUseQ } from '../functions/isUsernameInUse'
import { newUserRequestInsertQ } from '../functions/newUserRequest'
import { ActiveUser, UserAuthDB, WaitingFirstActivationUser } from '../types'
export const storeNewSignupRequest = (db: UserAuthDB): Pick<SignUpAdapter, 'storeNewSignupRequest'> => ({
  storeNewSignupRequest: async ({ email, token }) => {
    const insertQ = newUserRequestInsertQ({ email, token })
    const newWaitingFirstActivationUser = (await getOneResult(insertQ, db)) as WaitingFirstActivationUser | null
    if (!newWaitingFirstActivationUser) {
      return 'email not available'
    }
    return // newWaitingFirstActivationUser
  },
})

export const activateNewUser = (db: UserAuthDB): Pick<NewUserConfirmAdapter, 'activateUser'> => ({
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

export const createNewUser = (db: UserAuthDB): Pick<CreateNewUserAdapter, 'createUser'> => ({
  async createUser({ password, email, username, role }) {
    const userNameInUseQ = isUsernameInUseQ({ username })
    const userNameInUse = (await getOneResult(userNameInUseQ, db)) as true | null
    if (userNameInUse) {
      return 'username not available'
    }
    const emailInUseQ = isEmailInUseQ({ email })
    const isEmailInUse = (await getOneResult(emailInUseQ, db)) as true | null
    if (isEmailInUse) {
      return 'email not available'
    }

    const createQ = createNewUserQ({ password, username, email, role })
    // TODO: Queries should be typed kinda  `type QueryType<T> = string & T`
    // so, `getOneResult` returns correct type
    const activeUser = (await getOneResult(createQ, db)) as ActiveUser | null
    console.log(`\n\n\n\n\n\n\n\n\n\n\n`)
    console.log({ activeUser })
    console.log(`\n\n\n\n\n\n\n\n\n\n\n`)
    return activeUser
  },
})
