import { EmailTemplate } from '../../../backend/src/lib/emailSender/types'

export enum Messages {
  EmailNotAvailable = 'email-not-available',
  UsernameNotAvailable = 'username-not-available',
  NotFound = 'not-found',
}
export type ActivationMessage = Messages.NotFound | Messages.UsernameNotAvailable

// ^ UserAuth
export type Status = 'Active' | 'WaitingFirstActivation'

type UserBase<S extends Status> = {
  id: UserId
  status: S
  email: Email
  createdAt: number
  updatedAt: number
}

export type ActiveUser = UserBase<'Active'> & {
  authId: AuthId
  password: Password
}
export type WaitingFirstActivationUser = UserBase<'WaitingFirstActivation'> & {
  firstActivationToken: Token
}

export type User = ActiveUser | WaitingFirstActivationUser

// $ UserAuth

// ^ Config
export type UserAuthConfig = {
  newUserRequestEmail: EmailTemplate<NewUserRequestEmailVars>
  newUserVerificationWaitSecs: TimeoutSecs
}
// $ Config
export type NewUserRequestEmailVars = {
  email: Email
  link: Link
}

export type Email = string
export type Link = string
export type UserId = string
export type AuthId = string
export type Password = string
export type Token = string
export type TimeoutSecs = number
