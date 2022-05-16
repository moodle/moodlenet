import { getOneResult } from '../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../lib/plug'
import { saveActiveUserAdapter } from '../../../../ports/user-auth/adapters'
import { ActiveUser } from '../../../../ports/user-auth/types'
import { createNewUserQ, CreateNewUserQArg } from '../queries/createNewUser'
import { UserAuthDB } from '../types'

export const saveActiveUser =
  (db: UserAuthDB): SockOf<typeof saveActiveUserAdapter> =>
  async ({ authId, email, password, status }) => {
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
    return newWaitingFirstActivationUser
  }
