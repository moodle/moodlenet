import { Database } from 'arangojs'
import { QMDeployer } from '../../../../lib/qmino/types'
import { confirmSignup, NewUserConfirmAdapter, signUp, SignUpAdapter } from '../../../../ports/user-auth/new-user'
import { getOneResult } from '../../../content-graph/arangodb/functions/helpers'
import { activateNewUserQ } from '../functions/activateNewUser'
import { isUsernameInUseQ } from '../functions/isUsernameInUse'
import { newUserRequestInsertQ } from '../functions/newUserRequest'
import { ActiveUser, WaitingFirstActivationUser } from '../types'
export const storeNewSignupRequest = (
  db: Database,
  { generateToken, publicBaseUrl, sendEmail }: Omit<SignUpAdapter, 'storeNewSignupRequest'>,
): QMDeployer<typeof signUp> => [
  async action => {
    return action({
      storeNewSignupRequest: async ({ email, token }) => {
        const insertQ = newUserRequestInsertQ({ email, token })
        const newWaitingFirstActivationUser = (await getOneResult(insertQ, db)) as WaitingFirstActivationUser | null
        if (!newWaitingFirstActivationUser) {
          return 'email not available'
        }
        return // newWaitingFirstActivationUser
      },
      generateToken,
      publicBaseUrl,
      sendEmail,
    })
  },
  async () => {},
]

export const activateNewUser = (
  db: Database,
  { hashPassword, generateProfileId, createNewProfile }: Omit<NewUserConfirmAdapter, 'activateUser'>,
): QMDeployer<typeof confirmSignup> => [
  async action => {
    return action({
      activateUser: async ({ password, profileId, token, username }) => {
        const userNameInUseQ = isUsernameInUseQ({ username })
        const userNameInUse = (await getOneResult(userNameInUseQ, db)) as true | null
        if (userNameInUse) {
          return 'username not available'
        }

        const activateQ = activateNewUserQ({ password, profileId, token, username })
        // Queries should be typed kinda  `type QueryType<T> = string & T`
        // so, `getOneResult` returns correct type
        const activeUser = (await getOneResult(activateQ, db)) as ActiveUser | null
        if (!activeUser) {
          return 'not found'
        }
        return activeUser
      },
      hashPassword,
      generateProfileId,
      createNewProfile,
    })
  },
  async () => {},
]
