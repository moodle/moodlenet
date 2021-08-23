import { getOneResult } from '../../../../lib/helpers/arango/query'
import { Adapter } from '../../../../ports/user-auth/user'
import { SendEmailToProfileAdapter } from '../../../../ports/utils/utils'
import { getActiveUserByAuthIdQ } from '../queries/getUserByAuth'
import { getUserByEmailQ } from '../queries/getUserByEmail'
import { UserAuthDB } from '../types'
export const byEmail = (db: UserAuthDB): Pick<Adapter, 'getActiveUserByEmail'> => ({
  getActiveUserByEmail: async ({ email }) => {
    const activeUserQ = getUserByEmailQ({ email })
    const mUser = await getOneResult(activeUserQ, db)
    if (!(mUser && mUser.status === 'Active')) {
      return null
    }
    return mUser
  },
})
export const byAuthId = (db: UserAuthDB): Pick<SendEmailToProfileAdapter, 'getActiveUserByAuth'> => ({
  getActiveUserByAuth: async ({ authId }) => {
    const activeUserQ = getActiveUserByAuthIdQ({ authId })
    const mUser = await getOneResult(activeUserQ, db)
    return mUser
  },
})
