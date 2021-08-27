import { AuthId } from '@moodlenet/common/lib/content-graph/types/common'
import { Email } from '../../ports/user-auth/types'

export type PasswordVerifier = (_: { plainPwd: string; pwdHash: string }) => Promise<boolean>
export type PasswordHasher = (pwd: string) => Promise<string>

export type SessionEnv = {
  user: {
    authId: AuthId
    email: Email
  }
}
