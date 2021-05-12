import { Role } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Id } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { Database } from 'arangojs'
import { DocumentCollection } from 'arangojs/collection'
import { ChangeUserEmailRequestEmailVars } from '../../../emailTemplates/changeUserEmailRequestEmail'
import { NewUserRequestEmailVars } from '../../../emailTemplates/newUserRequestEmail'
import { TempSessionEmailVars } from '../../../emailTemplates/tempSessionEmail'
import { WithCreated, WithId, WithMutable } from '../../../lib/helpers/types'
import { EmailTemplate } from '../../../types'

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

export type Persistence = {
  db: Database
  User: DocumentCollection<UserRecord>
  Config: DocumentCollection<UserAuthConfig>
}

// ^ Document Collections
export const USER = 'User'
export const CONFIG = 'Config'
