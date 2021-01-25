import { RespondApiHandler } from '../../../../lib/domain'
import { Api } from '../../../../lib/domain/api/types'
import { Event } from '../../../../lib/domain/event/types'
import { graphQLRequestApiCaller } from '../../../MoodleNetGraphQL'
import { Messages } from '../persistence/types'
import { getAccountPersistence } from '../UserAccount.env'
import { MutationResolvers } from '../UserAccount.graphql.gen'
import { getVerifiedAccountByUsernameAndPassword } from '../UserAccount.helpers'

export type ConfirmAccountEmailChangeRequestPersistence = (_: {
  token: string
}) => Promise<null | Messages.NotFound>

export type AccountEmailChangedEvent = Event<{
  accountId: string
  newEmail: string
  oldEmail: string
}>

export type ConfirmAndChangeAccountEmailApi = Api<
  { token: string; password: string; username: string },
  { done: boolean }
>

export const ConfirmAndChangeAccountEmailHandler = async () => {
  const { confirmAccountEmailChangeRequest } = await getAccountPersistence()

  const handler: RespondApiHandler<ConfirmAndChangeAccountEmailApi> = async ({
    req: { token, password, username },
  }) => {
    const account = await getVerifiedAccountByUsernameAndPassword({
      username,
      password,
    })

    if (!account) {
      return { done: false }
    }

    const confirmError = await confirmAccountEmailChangeRequest({ token })

    if (confirmError) {
      return { done: false }
    } else {
      return { done: true }
    }
  }

  return handler
}

export const changeEmailConfirm: MutationResolvers['changeEmailConfirm'] = async (
  _parent,
  { token, password, username }
) => {
  const { res } = await graphQLRequestApiCaller({
    api: 'UserAccount.ChangeMainEmail.ConfirmAndChangeAccountEmail',
    req: { password, token, username },
  })
  return res.___ERROR ? false : res.done
}
