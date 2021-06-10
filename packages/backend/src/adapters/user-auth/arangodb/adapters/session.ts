import { getOneResult } from '../../../../lib/helpers/arango'
import { Adapter } from '../../../../ports/user-auth/user'
import { getActiveUserByUsernameQ } from '../functions/getActiveUserByUsername'
import { ActiveUser, UserAuthDB } from '../types'
export const byUsername = (db: UserAuthDB): Pick<Adapter, 'getActiveUserByUsername'> => ({
  getActiveUserByUsername: async ({ username }) => {
    const activeUserQ = getActiveUserByUsernameQ({ username })
    const activeUser = (await getOneResult(activeUserQ, db)) as ActiveUser | null
    if (!activeUser) {
      return null
    }
    return activeUser
  },
})
