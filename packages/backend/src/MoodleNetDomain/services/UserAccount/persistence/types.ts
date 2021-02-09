import { Maybe, WithCreated, WithFlow, WithId, WithMutable } from '../../../../lib/helpers/types'
import { EmailObj } from '../../Email/types'
import { ConfirmAccountEmailChangeRequestPersistence } from '../apis/UserAccount.ChangeMainEmail.ConfirmAndChangeAccountEmail'
import { ChangeAccountEmailRequestDeletePersistence } from '../apis/UserAccount.ChangeMainEmail.DeleteRequest'
import { ChangeAccountEmailRequestPersistence } from '../apis/UserAccount.ChangeMainEmail.Request.'
import { ChangePasswordPersistence } from '../apis/UserAccount.ChangePassword'
import { ActivateNewAccountPersistence } from '../apis/UserAccount.RegisterNewAccount.ActivateNewAccount'
import { NewAccountRequestDeletePersistence } from '../apis/UserAccount.RegisterNewAccount.DeleteRequest'
import { NewAccountRequestPersistence } from '../apis/UserAccount.RegisterNewAccount.Request'
import { ChangeAccountEmailRequestEmailVars } from '../assets/defaultConfig/changeAccountEmailRequestEmail'
import { NewAccountRequestEmailVars } from '../assets/defaultConfig/newAccountRequestEmail'
import { TempSessionEmailVars } from '../assets/defaultConfig/tempSessionEmail'
import { Resolvers } from '../UserAccount.graphql.gen'

export interface UserAccountPersistence {
  graphQLTypeResolvers: Omit<Resolvers, 'Mutation'>

  getActiveAccountByUsername(_: { username: string }): Promise<Maybe<ActiveUserAccount>>
  deleteChangeAccountEmailRequest: ChangeAccountEmailRequestDeletePersistence
  deleteNewAccountRequest: NewAccountRequestDeletePersistence
  isEmailAvailable(_: { email: string }): Promise<boolean>
  isUsernameAvailable(_: { username: string }): Promise<boolean>
  newAccountRequest: NewAccountRequestPersistence
  changePassword: ChangePasswordPersistence
  changeAccountEmailRequest: ChangeAccountEmailRequestPersistence
  confirmAccountEmailChangeRequest: ConfirmAccountEmailChangeRequestPersistence
  activateNewAccount: ActivateNewAccountPersistence
  getConfig(): Promise<Config>
}

export enum Messages {
  EmailNotAvailable = 'email-not-available',
  UsernameNotAvailable = 'username-not-available',
  NotFound = 'not-found',
}

// ^ UserAccount
export enum UserAccountStatus {
  Active = 'active',
  WaitingFirstActivation = 'waiting-first-activation',
}

type UserAccountRecordBase = WithId &
  WithFlow &
  WithMutable & {
    email: string
    firstActivationToken: string
  }
export type ActiveUserAccount = UserAccountRecordBase & {
  status: Exclude<UserAccountStatus, UserAccountStatus.WaitingFirstActivation>
  username: string
  password: string
  changeEmailRequest: null | ChangeEmailRequest
}
export type WaitingFirstActivationUserAccount = UserAccountRecordBase & {
  status: UserAccountStatus.WaitingFirstActivation
}
export type UserAccountRecord = ActiveUserAccount | WaitingFirstActivationUserAccount

export type ChangeEmailRequest = WithFlow &
  WithCreated & {
    token: string
    email: string
  }
// $ UserAccount

// ^ Config
export type Config = WithCreated & {
  newAccountRequestEmail: EmailTemplate<NewAccountRequestEmailVars>
  changeAccountEmailRequestEmail: EmailTemplate<ChangeAccountEmailRequestEmailVars>
  tempSessionEmail: EmailTemplate<TempSessionEmailVars>
  newAccountVerificationWaitSecs: number
  changeAccountEmailVerificationWaitSecs: number
}
// $ Config

export type EmailTemplate<Vars> = Pick<EmailObj, 'from' | 'subject' | 'html' | 'text'> & {
  $fake?: Vars
}
