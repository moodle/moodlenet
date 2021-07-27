import { AuthId, Email } from '@moodlenet/common/lib/user-auth/types'

export type PasswordVerifier = (_: { providedPwdHash: string; currentPwdHash: string }) => Promise<boolean>

export type SessionEnv = {
  user: {
    authId: AuthId
    email: Email
  }
}
