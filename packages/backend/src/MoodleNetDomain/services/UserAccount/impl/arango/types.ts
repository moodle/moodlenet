import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { Database } from 'arangojs'
import { DocumentCollection } from 'arangojs/collection'
import { WithCreated, WithFlow, WithId, WithMutable } from '../../../../../lib/helpers/types'
import { Role } from '../../../../types'
import { EmailTemplate } from '../../../Email/helpers'
import { ChangeAccountEmailRequestEmailVars } from '../../assets/defaultConfig/changeAccountEmailRequestEmail'
import { NewAccountRequestEmailVars } from '../../assets/defaultConfig/newAccountRequestEmail'
import { TempSessionEmailVars } from '../../assets/defaultConfig/tempSessionEmail'

export enum Messages {
  EmailNotAvailable = 'email-not-available',
  UsernameNotAvailable = 'username-not-available',
  NotFound = 'not-found',
}
export type ActivationMessage = Messages.NotFound | Messages.UsernameNotAvailable

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
  role: Role
  userId: Id
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
export type UserAccountConfig = WithCreated & {
  newAccountRequestEmail: EmailTemplate<NewAccountRequestEmailVars>
  changeAccountEmailRequestEmail: EmailTemplate<ChangeAccountEmailRequestEmailVars>
  tempSessionEmail: EmailTemplate<TempSessionEmailVars>
  newAccountVerificationWaitSecs: number
  changeAccountEmailVerificationWaitSecs: number
}
// $ Config

export type Persistence = {
  db: Database
  UserAccount: DocumentCollection<UserAccountRecord>
  Config: DocumentCollection<UserAccountConfig>
}
