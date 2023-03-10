import { DocumentMetadata } from '@moodlenet/arangodb/server'

export type Email = string
export type Password = string

export type EmailPwdUser = EmailPwdUserData & { _key: string }
export type EmailPwdUserData = {
  email: Email
  password: Password
  created: string
  webUserKey: string
}
export type EmailPwdUserDoc = EmailPwdUserData & DocumentMetadata
