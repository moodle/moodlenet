import { Database } from 'arangojs'
import { QMDeployer } from '../../../../lib/qmino/types'
import { Adapter, getActiveByUsername } from '../../../../ports/user-auth/user'
import { getOneResult } from '../../../content-graph/arangodb/functions/helpers'
import { getActiveUserByUsernameQ } from '../functions/getActiveUserByUsername'
import { ActiveUser } from '../types'
export const byUsername = (
  db: Database,
  verifyPassword: Adapter['verifyPassword'],
): QMDeployer<typeof getActiveByUsername> => [
  async action => {
    return action({
      getActiveUserByUsername: async ({ username }) => {
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
