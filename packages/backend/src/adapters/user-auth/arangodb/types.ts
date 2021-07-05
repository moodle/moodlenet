import { Role } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { ChangeUserEmailRequestEmailVars } from '../../../initialData/user-auth/defaultConfig/changeUserEmailRequestEmail'
import { NewUserRequestEmailVars } from '../../../initialData/user-auth/defaultConfig/newUserRequestEmail'
import { TempSessionEmailVars } from '../../../initialData/user-auth/defaultConfig/tempSessionEmail'
import { EmailTemplate } from '../../../lib/emailSender/types'
import { VersionedDB } from '../../../lib/helpers/arango/migrate/types'
import { WithCreated, WithId, WithMutable } from '../../../lib/helpers/types'

export type UserAuthDB = VersionedDB<'0.0.2'>

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
  WithMutable & {
    email: string
    firstActivationToken: string | undefined
  }
export type ActiveUser = UserRecordBase & {
  status: Exclude<UserStatus, UserStatus.WaitingFirstActivation>
  username: string
  password: string
  changeEmailRequest: null | ChangeEmailRequest
  role: Role
}
export type WaitingFirstActivationUser = UserRecordBase & {
  status: UserStatus.WaitingFirstActivation
}
export type UserRecord = ActiveUser | WaitingFirstActivationUser

export type ChangeEmailRequest = WithCreated & {
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

// ^ Document Collections
export const USER = 'User'
export const CONFIG = 'Config'
