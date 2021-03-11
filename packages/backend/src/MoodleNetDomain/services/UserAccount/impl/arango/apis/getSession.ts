import { call } from '../../../../../../lib/domain/amqp/call'
import { WrkTypes } from '../../../../../../lib/domain/wrk'
import { userSessionByActiveUserAccount } from '../../../helpers'
import { QueryResolvers } from '../../../UserAccount.graphql.gen'
import { getActiveAccountByUsername } from '../functions/getActiveAccountByUsername'
import { MoodleNetArangoUserAccountSubDomain } from '../MoodleNetArangoUserAccountSubDomain'
import { Persistence } from '../types'

export type T = WrkTypes<MoodleNetArangoUserAccountSubDomain, 'UserAccount.Session.Get'>

export const SessionGetWorker = ({ persistence }: { persistence: Persistence }) => {
  const worker: T['Worker'] = async ({ username }) => {
    const account = await getActiveAccountByUsername({ persistence, username })

    if (!account) {
      return null
    }

    const session = userSessionByActiveUserAccount({
      activeUserAccount: account,
    })

    return session
  }
  return worker
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
