import { getOneResult } from '../../../../lib/helpers/arango/query'
import { Adapter } from '../../../../ports/user-auth/user'
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
