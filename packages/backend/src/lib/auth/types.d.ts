import { AuthId, Email } from '@moodlenet/common/lib/user-auth/types'

export type PasswordVerifier = (_: { plainPwd: string; pwdHash: string }) => Promise<boolean>
export type PasswordHasher = (pwd: string) => Promise<string>

export type SessionEnv = {
  user: {
    authId: AuthId
    email: Email
  }
}
