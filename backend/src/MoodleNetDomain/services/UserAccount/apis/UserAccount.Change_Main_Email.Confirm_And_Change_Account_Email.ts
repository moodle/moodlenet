import { RespondApiHandler } from '../../../../lib/domain'
import { Api } from '../../../../lib/domain/api/types'
import { Event } from '../../../../lib/domain/event/types'
import { graphQLRequestApiCaller } from '../../../MoodleNetGraphQL'
import { Messages } from '../persistence/types'
import { getAccountPersistence } from '../UserAccount.env'
import { MutationResolvers } from '../UserAccount.graphql.gen'
import { getVerifiedAccountByUsername } from '../UserAccount.helpers'

export type ConfirmAccountEmailChangeRequestPersistence = (_: {
  token: string
}) => Promise<null | Messages.NotFound>

export type Account_Email_Changed_Event = Event<{
  accountId: string
  newEmail: string
  oldEmail: string
}>

export type Confirm_And_Change_Account_Email_Api = Api<
  { token: string; password: string; username: string },
  { done: boolean }
>

export const Confirm_And_Change_Account_Email_Handler = async () => {
  const { confirmAccountEmailChangeRequest } = await getAccountPersistence()

  const handler: RespondApiHandler<Confirm_And_Change_Account_Email_Api> = async ({
    req: { token, password, username },
  }) => {
    const account = await getVerifiedAccountByUsername({
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
    api: 'UserAccount.Change_Main_Email.Confirm_And_Change_Account_Email',
    req: { password, token, username },
  })
  return res.___ERROR ? false : res.done
}
