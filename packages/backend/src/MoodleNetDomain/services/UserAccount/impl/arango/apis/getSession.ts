import { call } from '../../../../../../lib/domain/amqp/call'
import { WrkTypes } from '../../../../../../lib/domain/wrk'
import { userSessionByActiveUserAccount } from '../../../helpers'
import { QueryResolvers } from '../../../UserAccount.graphql.gen'
import { ArangoUserAccountSubDomain } from '../ArangoUserAccountDomain'
import { DBReady, UserAccountDB } from '../env'
import { getActiveAccountByUsername } from '../functions/getActiveAccountByUsername'

export type T = WrkTypes<ArangoUserAccountSubDomain, 'UserAccount.Session.Get'>

export const SessionGetWrkInit: T['Init'] = async () => {
  const db = await DBReady
  return [SessionGetWorker({ db })]
}

export const SessionGetWorker = ({ db }: { db: UserAccountDB }) => {
  const worker: T['Worker'] = async ({ username }) => {
    const account = await getActiveAccountByUsername({ db, username })

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

  const maybeSession = await call<ArangoUserAccountSubDomain>()('UserAccount.Session.Get', context.flow)({ username })

  return maybeSession
}
