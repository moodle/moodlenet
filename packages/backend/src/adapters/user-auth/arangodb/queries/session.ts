import { Database } from 'arangojs'
import { QMDeployer } from '../../../../lib/qmino/types'
import { Adapter, getByUsername } from '../../../../ports/queries/user-auth/session'
import { getOneResult } from '../../../content-graph/arangodb/lib/helpers'
import { getActiveUserByUsernameQ } from '../functions/getActiveUserByUsername'
import { ActiveUser } from '../types'
export const byUsername = (
  db: Database,
  verifyPassword: Adapter['verifyPassword'],
): QMDeployer<typeof getByUsername> => [
  async action => {
    return action({
      getUserSessionByUsername: async ({ username }) => {
        const activeUserQ = getActiveUserByUsernameQ({ username })
        const activeUser = (await getOneResult(activeUserQ, db)) as ActiveUser | null
        if (!activeUser) {
          return null
        }
        return activeUser
      },
      verifyPassword,
    })
  },
  async () => {},
]
