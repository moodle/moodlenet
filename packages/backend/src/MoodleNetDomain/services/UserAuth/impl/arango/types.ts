import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { Database } from 'arangojs'
import { DocumentCollection } from 'arangojs/collection'
import { WithCreated, WithFlow, WithId, WithMutable } from '../../../../../lib/helpers/types'
import { Role } from '../../../../types'
import { EmailTemplate } from '../../../Email/helpers'
import { ChangeUserEmailRequestEmailVars } from '../../assets/defaultConfig/changeUserEmailRequestEmail'
import { NewUserRequestEmailVars } from '../../assets/defaultConfig/newUserRequestEmail'
import { TempSessionEmailVars } from '../../assets/defaultConfig/tempSessionEmail'

export enum Messages {
  EmailNotAvailable = 'email-not-available',
  UsernameNotAvailable = 'username-not-available',
  NotFound = 'not-found',
}
export type ActivationMessage = Messages.NotFound | Messages.UsernameNotAvailable

// ^ UserAuth
export enum UserStatus {
  Active = 'active',
  WaitingFirstActivation = 'waiting-first-activation',
}

type UserRecordBase = WithId &
  WithFlow &
  WithMutable & {
    email: string
    firstActivationToken: string
  }
export type ActiveUser = UserRecordBase & {
  status: Exclude<UserStatus, UserStatus.WaitingFirstActivation>
  username: string
  password: string
  changeEmailRequest: null | ChangeEmailRequest
  role: Role
  profileId: Id
}
export type WaitingFirstActivationUser = UserRecordBase & {
  status: UserStatus.WaitingFirstActivation
}
export type UserRecord = ActiveUser | WaitingFirstActivationUser

export type ChangeEmailRequest = WithFlow &
  WithCreated & {
    token: string
    email: string
  }
// $ UserAuth

// ^ Config
export type UserAuthConfig = WithCreated & {
  newUserRequestEmail: EmailTemplate<NewUserRequestEmailVars>
  changeUserEmailRequestEmail: EmailTemplate<ChangeUserEmailRequestEmailVars>
  tempSessionEmail: EmailTemplate<TempSessionEmailVars>
  newUserVerificationWaitSecs: number
  changeUserEmailVerificationWaitSecs: number
}
// $ Config

export type Persistence = {
  db: Database
  User: DocumentCollection<UserRecord>
  Config: DocumentCollection<UserAuthConfig>
}
