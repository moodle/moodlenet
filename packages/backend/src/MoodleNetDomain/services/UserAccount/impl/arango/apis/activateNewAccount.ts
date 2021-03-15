import { makeId, NodeType } from '@moodlenet/common/lib/utils/content-graph'
import { call } from '../../../../../../lib/domain/amqp/call'
import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { ulidKey } from '../../../../../../lib/helpers/arango'
import { MoodleNetDomain } from '../../../../../MoodleNetDomain'
import { hashPassword, jwtByActiveUserAccount } from '../../../helpers'
import { MutationResolvers } from '../../../UserAccount.graphql.gen'
import { activateNewAccount } from '../functions/activateNewAccount'
import { MoodleNetArangoUserAccountSubDomain } from '../MoodleNetArangoUserAccountSubDomain'
import { Persistence } from '../types'

export const ConfirmEmailActivateAccountWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<
  MoodleNetArangoUserAccountSubDomain,
  'UserAccount.RegisterNewAccount.ConfirmEmailActivateAccount'
> => async ({ flow, token, password, username }) => {
  const hashedPassword = await hashPassword({ pwd: password })
  const userKey = ulidKey()
  const userId = makeId(NodeType.User, userKey)
  const activationResult = await activateNewAccount({
    persistence,
    token,
    username,
    password: hashedPassword,
    userId,
  })
  if (typeof activationResult !== 'string') {
    await call<MoodleNetDomain>()('ContentGraph.CreateNewRegisteredUser', flow)({ username, key: userKey })

    return activationResult
  } else {
    return activationResult
  }
}

export const activateAccount: MutationResolvers['activateAccount'] = async (
  _parent,
  { password, username, token },
  context,
) => {
  const activeUserAccountOrErrString = await call<MoodleNetArangoUserAccountSubDomain>()(
    'UserAccount.RegisterNewAccount.ConfirmEmailActivateAccount',
    context.flow,
  )({ password, token, username, flow: context.flow })

  if (typeof activeUserAccountOrErrString === 'string') {
    return {
      __typename: 'CreateSession',
      jwt: null,
      message: activeUserAccountOrErrString,
    }
  } else {
    const activeUserAccount = activeUserAccountOrErrString
    const jwt = await jwtByActiveUserAccount({ activeUserAccount })

    return {
      __typename: 'CreateSession',
      jwt,
      message: null,
    }
  }
}
