import { api, event } from '../../../../lib/domain'
import { Event } from '../../../../lib/domain/event/types'
import { Flow } from '../../../../lib/domain/types/path'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { ActiveUserAccount, Messages } from '../persistence/types'
import { getAccountPersistence } from '../UserAccount.env'
import {
  ActivationOutcome,
  MutationResolvers,
  UserSession,
} from '../UserAccount.graphql.gen'
import {
  hashPassword,
  userSessionByActiveUserAccount,
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

export type ConfirmEmailActivateAccountReq = {
  token: string
  password: string
  username: string
  flow: Flow
}
export type ConfirmEmailActivateAccountRes = { activation: ActivationResult }

export const ConfirmEmailActivateAccountApiHandler = async ({
  flow,
  token,
  password,
  username,
}: ConfirmEmailActivateAccountReq): Promise<ConfirmEmailActivateAccountRes> => {
  const { activateNewAccount } = await getAccountPersistence()
  const hashedPassword = await hashPassword({ pwd: password })
  const activation = await activateNewAccount({
    token,
    username,
    password: hashedPassword,
  })
  if (typeof activation !== 'string') {
    event<MoodleNetDomain>(flow)(
      'UserAccount.RegisterNewAccount.NewAccountActivated'
    ).emit({
      payload: { accountId: activation._id, username: activation.username },
    })
  }
  return { activation }
}

export const activateAccount: MutationResolvers['activateAccount'] = async (
  _parent,
  { password, username, token },
  context
) => {
  const res = await api<MoodleNetDomain>(context.flow)(
    'UserAccount.RegisterNewAccount.ConfirmEmailActivateAccount'
  ).call((confirmEmailActivateAccount, flow) =>
    confirmEmailActivateAccount({ password, token, username, flow })
  )

  if (typeof res.activation === 'string') {
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
