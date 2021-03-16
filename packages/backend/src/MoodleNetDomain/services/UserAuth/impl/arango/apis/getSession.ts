import { call } from '../../../../../../lib/domain/amqp/call'
import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { userSessionByActiveUser } from '../../../helpers'
import { QueryResolvers } from '../../../UserAuth.graphql.gen'
import { getActiveUserByUsername } from '../functions/getActiveUserByUsername'
import { MoodleNetArangoUserAuthSubDomain } from '../MoodleNetArangoUserAuthSubDomain'
import { Persistence } from '../types'

export const SessionGetWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoUserAuthSubDomain, 'UserAuth.Session.Get'> => async ({ username }) => {
  const user = await getActiveUserByUsername({ persistence, username })

  if (!user) {
    return null
  }

  const session = await userSessionByActiveUser({
    activeUser: user,
  })

  return session
}

export const getSession: QueryResolvers['getSession'] = async (_parent, {}, context) => {
  const username = context.type === 'session' && context.username
  if (!username) {
    return null
  }

  const maybeSession = await call<MoodleNetArangoUserAuthSubDomain>()('UserAuth.Session.Get', context.flow)({
    username,
  })

  return maybeSession
}
