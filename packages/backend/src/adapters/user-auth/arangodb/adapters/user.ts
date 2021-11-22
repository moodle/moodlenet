import { getOneResult } from '../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../lib/plug'
import {
  changePasswordByAuthIdAdapter,
  getActiveUserByAuthAdapter,
  getActiveUserByEmailAdapter,
} from '../../../../ports/user-auth/adapters'
import { getActiveUserByAuthIdQ, updateActiveUserPasswordByAuthIdQ } from '../queries/getUserByAuth'
import { getUserByEmailQ } from '../queries/getUserByEmail'
import { UserAuthDB } from '../types'
export const getActiveUserByEmail =
  (db: UserAuthDB): SockOf<typeof getActiveUserByEmailAdapter> =>
  async ({ email }) => {
    const activeUserQ = getUserByEmailQ({ email })
    const mUser = await getOneResult(activeUserQ, db)
    if (!(mUser && mUser.status === 'Active')) {
      return null
    }
    return mUser
  }

export const getActiveUserByAuth =
  (db: UserAuthDB): SockOf<typeof getActiveUserByAuthAdapter> =>
  async ({ authId }) => {
    const activeUserQ = getActiveUserByAuthIdQ({ authId })
    const mUser = await getOneResult(activeUserQ, db)
    return mUser
  }

export const changePasswordByAuthId =
  (db: UserAuthDB): SockOf<typeof changePasswordByAuthIdAdapter> =>
  async ({ authId, newPassword }) => {
    const changePasswordQ = updateActiveUserPasswordByAuthIdQ({ authId, password: newPassword })
    const mUser = await getOneResult(changePasswordQ, db)
    return mUser
  }
