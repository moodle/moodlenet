import { DocumentMetadata } from '@moodlenet/arangodb'

export type Email = string
export type Password = string

export type EmailPwdUser = EmailPwdUserData & { _key: string }
export type EmailPwdUserData = {
  email: Email
  password: Password
  created: string
}
export type EmailPwdUserDoc = EmailPwdUserData & DocumentMetadata
