import { DistOmit } from '@moodlenet/common/lib/utils/types'
import { getOneResult } from '../../../../lib/helpers/arango/query'
import { SignUpAdapter } from '../../../../ports/user-auth/new-user'
import { ActiveUser } from '../../../../ports/user-auth/types'
import { createNewUserQ, CreateNewUserQArg } from '../queries/createNewUser'
import { UserAuthDB } from '../types'
import { getConfigAdapter } from './config'
export const storeNewSignupRequest = (db: UserAuthDB): Pick<SignUpAdapter, 'getConfig'> => ({
  getConfig: getConfigAdapter({ db }).getLatestConfig,
})

export const storeNewActiveUser =
  (db: UserAuthDB) =>
  async ({ authId, email, password, status }: DistOmit<ActiveUser, 'id' | 'createdAt' | 'updatedAt'>) => {
    const waitingFirstActivationUser: CreateNewUserQArg<ActiveUser> = {
      email,
      authId,
      password,
      status,
    }
    const insertQ = createNewUserQ(waitingFirstActivationUser)
    const newWaitingFirstActivationUser = await getOneResult(insertQ, db)
    if (!newWaitingFirstActivationUser) {
      return 'email not available'
    }
    return //newWaitingFirstActivationUser
  }

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
