import { call } from '../../../../../../lib/domain/amqp/call'
import { emit } from '../../../../../../lib/domain/amqp/emit'
import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { hashPassword, userSessionByActiveUserAccount } from '../../../helpers'
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
  const activationResult = await activateNewAccount({
    persistence,
    token,
    username,
    password: hashedPassword,
  })
  if (typeof activationResult !== 'string') {
    emit<MoodleNetArangoUserAccountSubDomain>()(
      'UserAccount.RegisterNewAccount.NewAccountActivated',
      { accountId: activationResult._id, username: activationResult.username },
      flow,
    )
    const session = await userSessionByActiveUserAccount({
      activeUserAccount: activationResult,
    })
    return session
  } else {
    return activationResult
  }
}

export const activateAccount: MutationResolvers['activateAccount'] = async (
  _parent,
  { password, username, token },
  context,
) => {
  const sessionOrMsg = await call<MoodleNetArangoUserAccountSubDomain>()(
    'UserAccount.RegisterNewAccount.ConfirmEmailActivateAccount',
    context.flow,
  )({ password, token, username, flow: context.flow })

  if (typeof sessionOrMsg === 'string') {
    return {
      __typename: 'ActivateNewAccountResponse',
      message: sessionOrMsg,
    }
  } else {
    return {
      __typename: 'ActivateNewAccountResponse',
      session: sessionOrMsg,
    }
  }
}
