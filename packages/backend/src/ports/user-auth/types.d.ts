import { AuthId } from '@moodlenet/common/lib/content-graph/types/common'
import { EmailTemplate } from '../../lib/emailSender/types'
export declare enum Messages {
  EmailNotAvailable = 'email-not-available',
  UsernameNotAvailable = 'username-not-available',
  NotFound = 'not-found',
}
export declare type ActivationMessage = Messages.NotFound | Messages.UsernameNotAvailable
export declare type Status = 'Active' | 'WaitingFirstActivation'
declare type UserBase<S extends Status> = {
  id: UserId
  status: S
  email: Email
  createdAt: number
  updatedAt: number
}
export declare type ActiveUser = UserBase<'Active'> & {
  authId: AuthId
  password: Password
}
export declare type WaitingFirstActivationUser = UserBase<'WaitingFirstActivation'> & {
  firstActivationToken: Token
}
export declare type User = ActiveUser | WaitingFirstActivationUser
export declare type UserAuthConfig = {
  newUserRequestEmail: EmailTemplate<NewUserRequestEmailVars>
  newUserVerificationWaitSecs: TimeoutSecs
}
export declare type NewUserRequestEmailVars = {
  email: Email
  link: Link
}
export declare type Email = string
export declare type Link = string
export declare type UserId = string
export declare type Password = string
export declare type Token = string
export declare type TimeoutSecs = number
export {}
//# sourceMappingURL=types.d.ts.map
