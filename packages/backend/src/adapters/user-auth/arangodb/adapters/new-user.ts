import { WaitingFirstActivationUser } from '@moodlenet/common/lib/user-auth/types'
import { getOneResult } from '../../../../lib/helpers/arango/query'
import { NewUserConfirmAdapter, SignUpAdapter } from '../../../../ports/user-auth/new-user'
import { activateNewUserQ } from '../queries/activateNewUser'
import { createNewUserQ, CreateNewUserQArg } from '../queries/createNewUser'
import { UserAuthDB } from '../types'
import { getConfigAdapter } from './config'
export const storeNewSignupRequest = (db: UserAuthDB): Pick<SignUpAdapter, 'storeNewSignupRequest' | 'getConfig'> => ({
  storeNewSignupRequest: async ({ email, firstActivationToken }) => {
    const waitingFirstActivationUser: CreateNewUserQArg<WaitingFirstActivationUser> = {
      email,
      firstActivationToken,
      status: 'WaitingFirstActivation',
    }
    const insertQ = createNewUserQ(waitingFirstActivationUser)
    const newWaitingFirstActivationUser = await getOneResult(insertQ, db)
    if (!newWaitingFirstActivationUser) {
      return 'email not available'
    }
    return //newWaitingFirstActivationUser
  },
  getConfig: getConfigAdapter({ db }).getLatestConfig,
})

export const activateNewUser = (db: UserAuthDB): Pick<NewUserConfirmAdapter, 'activateUser'> => ({
  activateUser: async ({ hashedPassword: password, token }) => {
    const activateQ = activateNewUserQ({ password, token })
    const activeUser = await getOneResult(activateQ, db)
    if (!activeUser) {
      return 'not found'
    }
    return activeUser
  },
})

// export const createNewUser = (db: UserAuthDB): Pick<CreateNewUserAdapter, 'createUser'> => ({
//   async createUser({ password, email, username, role }) {
//     const userNameInUseQ = isUsernameInUseQ({ username })
//     const userNameInUse = (await getOneResult(userNameInUseQ, db)) as true | null
//     if (userNameInUse) {
//       return 'username not available'
//     }
//     const emailInUseQ = isEmailInUseQ({ email })
//     const isEmailInUse = (await getOneResult(emailInUseQ, db)) as true | null
//     if (isEmailInUse) {
//       return 'email not available'
//     }

//     const createQ = createNewUserQ({ password, username, email, role })
//     const activeUser = (await getOneResult(createQ, db)) as ActiveUser | null
//     console.log(`\n\n\n\n\n\n\n\n\n\n\n`)
//     console.log({ activeUser })
//     console.log(`\n\n\n\n\n\n\n\n\n\n\n`)
//     return activeUser
//   },
// })
