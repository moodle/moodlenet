import { Database } from 'arangojs'
import { Adapter } from '../../../../ports/user-auth/user'
import { getOneResult } from '../../../content-graph/arangodb/functions/helpers'
import { getActiveUserByUsernameQ } from '../functions/getActiveUserByUsername'
import { ActiveUser } from '../types'
export const byUsername = (db: Database): Pick<Adapter, 'getActiveUserByUsername'> => ({
  getActiveUserByUsername: async ({ username }) => {
    const activeUserQ = getActiveUserByUsernameQ({ username })
    const activeUser = (await getOneResult(activeUserQ, db)) as ActiveUser | null
    if (!activeUser) {
      return null
    }
    return activeUser
  },
})
