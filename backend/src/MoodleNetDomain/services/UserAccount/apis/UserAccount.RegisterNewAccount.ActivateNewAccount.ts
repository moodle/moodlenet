import { MoodleNet } from '../../..'
import { RespondApiHandler } from '../../../../lib/domain'
import { Api } from '../../../../lib/domain/api/types'
import { Event } from '../../../../lib/domain/event/types'
import { graphQLRequestApiCaller } from '../../../MoodleNetGraphQL'
import { ActiveUserAccount, Messages } from '../persistence/types'
import { getAccountPersistence } from '../UserAccount.env'
import {
  ActivationOutcome,
  MutationResolvers,
  UserSession,
} from '../UserAccount.graphql.gen'
import {
  userSessionByActiveUserAccount,
  hashPassword,
} from '../UserAccount.helpers'

export type NewAccountActivatedEvent = Event<{
  accountId: string
  username: string
}>

type ActivationResult =
  | ActiveUserAccount
  | Messages.NotFound
  | Messages.UsernameNotAvailable

export type ActivateNewAccountPersistence = (_: {
  token: string
  username: string
  password: string
}) => Promise<ActivationResult>

export type ConfirmEmailActivateAccountApi = Api<
  { token: string; password: string; username: string },
  { activation: ActivationResult }
>

export const ConfirmEmailActivateAccountApiHandler = async () => {
  const { activateNewAccount } = await getAccountPersistence()
  const handler: RespondApiHandler<ConfirmEmailActivateAccountApi> = async ({
    flow,
    req: { token, password, username },
  }) => {
    const hashedPassword = await hashPassword({ pwd: password })
    const activation = await activateNewAccount({
      token,
      username,
      password: hashedPassword,
    })
    if (typeof activation !== 'string') {
      MoodleNet.emitEvent({
        event: 'UserAccount.RegisterNewAccount.NewAccountActivated',
        flow,
        payload: { accountId: activation._id, username: activation.username },
      })
    }
    return { activation }
  }
  return handler
}

export const activateAccount: MutationResolvers['activateAccount'] = async (
  _parent,
  { password, username, token }
) => {
  const { res } = await graphQLRequestApiCaller({
    api: 'UserAccount.RegisterNewAccount.ConfirmEmailActivateAccount',
    req: { password, token, username },
  })
  if (res.___ERROR) {
    return getActivatinOutcome({
      session: null,
      message: res.___ERROR.msg,
    })
  } else if (typeof res.activation === 'string') {
    return getActivatinOutcome({
      session: null,
      message: res.activation,
    })
  } else {
    const session = await userSessionByActiveUserAccount({
      activeUserAccount: res.activation,
    })

    return getActivatinOutcome({
      session,
      message: null,
    })
  }
}
const getActivatinOutcome = ({
  session,
  message,
}: {
  session: UserSession | null
  message: string | null
}): ActivationOutcome => ({
  __typename: 'ActivationOutcome',
  session,
  message,
})
