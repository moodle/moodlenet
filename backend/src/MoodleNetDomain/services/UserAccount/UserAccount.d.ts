import { Api } from '../../../lib/domain/api/types'
import { Event } from '../../../lib/domain/event/types'
import { GraphQLApi } from '../../MoodleNetGraphQL'
import { ActiveUserAccount } from './persistence/types'

export type UserAccount = {
  Register_New_Account: {
    Request: Api<
      AccountRequest,
      { success: true } | { success: false; reason: string }
    >
    Confirm_Email_Activate_Account: Api<
      { token: string; password: string; username: string },
      MaybeSessionAuth
    >
    NewAccountActivated: Event<{ accountId: string; username: string }>
  }
  Change_Main_Email: {
    Request: Api<
      ChangeAccountEmailRequest,
      { success: true } | { success: false; reason: string }
    >
    Confirm_And_Change_Account_Email: Api<
      { token: string; password: string; username: string },
      { done: boolean }
    >
    Cancel_Change_Account_Email_Request: Api<{ accountId: string }, {}>
    AccountEmailChanged: Event<{
      accountId: string
      newEmail: string
      oldEmail: string
    }>
  }
  Change_Password: Api<
    { username: string; currentPassword: string; newPassword: string },
    { success: true } | { success: false; reason: string }
  >

  Session: {
    By_Email: Api<
      { email: string; username: string },
      { success: true } | { success: false; reason: string }
    >
    Create: Api<{ username: string; password: string }, MaybeSessionAuth>
  }
  GQL: GraphQLApi
}

export type MaybeSessionAuth = {
  auth: { jwt: string; userAccount: ActiveUserAccount } | null
}
export type AccountRequest = { email: string }
export type ChangeAccountEmailRequest = { accountId: string; newEmail: string }
