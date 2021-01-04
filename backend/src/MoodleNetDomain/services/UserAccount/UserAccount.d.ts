import { Api } from '../../../lib/domain/api/types'
import { Event } from '../../../lib/domain/event/types'
import { GraphQLApi } from '../../MoodleNetGraphQL'
import { UserAccountRecord } from './persistence/types'

export type UserAccount = {
  Register_New_Account: {
    Request: Api<
      AccountRequest,
      { success: true } | { success: false; reason: string }
    >
    Confirm_Email_Activate_Account: Api<
      { token: string; password: string; username: string },
      { success: true } | { success: false; reason: string }
    >
    NewAccountActivated: Event<{ accountId: string }>
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
    Create: Api<
      { username: string; password: string },
      { auth: { jwt: string; userAccount: UserAccountRecord } | null }
    >
  }
  GQL: GraphQLApi
}

export type AccountRequest = { email: string }
export type ChangeAccountEmailRequest = { accountId: string; newEmail: string }
