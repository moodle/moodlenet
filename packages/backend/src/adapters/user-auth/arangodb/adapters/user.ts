import { AuthId } from '@moodlenet/common/lib/content-graph/types/common'
import { getOneResult } from '../../../../lib/helpers/arango/query'
import { GetActiveByEmailAdapter } from '../../../../ports/user-auth/user'
import { SendEmailToProfileAdapter } from '../../../../ports/utils/utils'
import { getActiveUserByAuthIdQ, updateActiveUserPasswordByAuthIdQ } from '../queries/getUserByAuth'
import { getUserByEmailQ } from '../queries/getUserByEmail'
import { UserAuthDB } from '../types'
export const byEmail = (db: UserAuthDB): Pick<GetActiveByEmailAdapter, 'getActiveUserByEmail'> => ({
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

export const updateUserPasswordByAuthId =
  (db: UserAuthDB) =>
  async ({ authId, password }: { authId: AuthId; password: string }) => {
    const changePasswordQ = updateActiveUserPasswordByAuthIdQ({ authId, password })
    const mUser = await getOneResult(changePasswordQ, db)
    return !!mUser
  }
