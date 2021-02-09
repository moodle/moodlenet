import { api } from '../../../../lib/domain'
import { Event } from '../../../../lib/domain/event/types'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { Messages } from '../persistence/types'
import { getAccountPersistence } from '../UserAccount.env'
import { MutationResolvers } from '../UserAccount.graphql.gen'
import { getVerifiedAccountByUsernameAndPassword } from '../UserAccount.helpers'

export type ConfirmAccountEmailChangeRequestPersistence = (_: { token: string }) => Promise<null | Messages.NotFound>

export type AccountEmailChangedEvent = Event<{
  accountId: string
  newEmail: string
  oldEmail: string
}>

export type Req = { token: string; password: string; username: string }

export const ConfirmAndChangeAccountEmailHandler = async ({ token, password, username }: Req): Promise<boolean> => {
  const { confirmAccountEmailChangeRequest } = await getAccountPersistence()
  const account = await getVerifiedAccountByUsernameAndPassword({
    username,
    password,
  })

  if (!account) {
    return false
  }

  const confirmError = await confirmAccountEmailChangeRequest({ token })
  if (confirmError) {
    return false
  }

  //TODO: emit AccountEmailChangedEvent
  return true
}

export const changeEmailConfirm: MutationResolvers['changeEmailConfirm'] = async (
  _parent,
  { token, password, username },
  ctx,
) => {
  return api<MoodleNetDomain>(ctx.flow)('UserAccount.ChangeMainEmail.ConfirmAndChangeAccountEmail').call(confirm =>
    confirm({ password, token, username }),
  )
}
