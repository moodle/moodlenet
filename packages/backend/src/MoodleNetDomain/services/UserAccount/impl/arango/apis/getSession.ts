import { call } from '../../../../../../lib/domain/amqp/call'
import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { userSessionByActiveUserAccount } from '../../../helpers'
import { QueryResolvers } from '../../../UserAccount.graphql.gen'
import { getActiveAccountByUsername } from '../functions/getActiveAccountByUsername'
import { MoodleNetArangoUserAccountSubDomain } from '../MoodleNetArangoUserAccountSubDomain'
import { Persistence } from '../types'

export const SessionGetWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoUserAccountSubDomain, 'UserAccount.Session.Get'> => async ({ username }) => {
  const account = await getActiveAccountByUsername({ persistence, username })

  if (!account) {
    return null
  }

  const session = await userSessionByActiveUserAccount({
    activeUserAccount: account,
  })

  return session
}

export const getSession: QueryResolvers['getSession'] = async (_parent, {}, context) => {
  const username = context.type === 'session' && context.username
  if (!username) {
    return null
  }

  const maybeSession = await call<MoodleNetArangoUserAccountSubDomain>()('UserAccount.Session.Get', context.flow)({
    username,
  })

  return maybeSession
}
