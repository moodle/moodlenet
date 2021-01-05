import { Flow } from '../../../../lib/domain/types/path'
import {
  Maybe,
  WithCreated,
  WithFlow,
  WithId,
  WithMutable,
} from '../../../../lib/helpers/types'
import { EmailObj } from '../../Email/types'
import { ChangeAccountEmailRequestEmailVars } from '../assets/defaultConfig/changeAccountEmailRequestEmail'
import { NewAccountRequestEmailVars } from '../assets/defaultConfig/newAccountRequestEmail'
import { TempSessionEmailVars } from '../assets/defaultConfig/tempSessionEmail'
import { Resolvers } from '../UserAccount.graphql.gen'

export interface UserAccountPersistence {
  graphQLTypeResolvers: Omit<Resolvers, 'Mutation'>

  getActiveAccountByUsername(_: {
    username: string
  }): Promise<Maybe<ActiveUserAccount>>

  removeNewAccountRequest(_: { token: string }): Promise<unknown>

  isEmailAvailable(_: { email: string }): Promise<boolean>
  isUsernameAvailable(_: { username: string }): Promise<boolean>

  newAccountRequest(_: {
    email: string
    token: string
    flow: Flow
  }): Promise<null | Messages.EmailNotAvailable>

  changePassword(_: {
    currentPassword: string
    newPassword: string
    accountId: string
  }): Promise<null | Messages.NotFound>

  changeAccountEmailRequest(_: {
    flow: Flow
    token: string
    accountId: string
    newEmail: string
  }): Promise<
    UserAccountRecord | Messages.EmailNotAvailable | Messages.NotFound
  >

  confirmAccountEmailChangeRequest(_: {
    token: string
  }): Promise<null | Messages.NotFound>

  removeChangeAccountEmailRequest(_: { token: string }): Promise<unknown>

  activateNewAccount(_: {
    token: string
    username: string
    password: string
  }): Promise<
    ActiveUserAccount | Messages.NotFound | Messages.UsernameNotAvailable
  >

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
export type UserAccountRecord =
  | ActiveUserAccount
  | WaitingFirstActivationUserAccount

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
  sessionValiditySecs: number
}
// $ Config

export type EmailTemplate<Vars> = Pick<
  EmailObj,
  'from' | 'subject' | 'html' | 'text'
> & { $fake?: Vars }
