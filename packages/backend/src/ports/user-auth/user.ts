import { ActiveUser } from '@moodlenet/common/lib/user-auth/types'
import { PasswordVerifier } from '../../lib/auth/types'
import { QMModule, QMQuery } from '../../lib/qmino'

export type Adapter = {
  getActiveUserByEmail(_: { email: string }): Promise<ActiveUser | null>
  verifyPassword: PasswordVerifier
}
export type Input = { email: string; matchHashedPassword: string | false }
export const getActiveByEmail = QMQuery(
  ({ email, matchHashedPassword }: Input) =>
    async ({ getActiveUserByEmail, verifyPassword }: Adapter) => {
      const activeUser = await getActiveUserByEmail({ email })
      if (!activeUser) {
        return null
      }
      if (matchHashedPassword === false) {
        return activeUser
      }
      const passwordMatches = await verifyPassword({
        providedPwdHash: matchHashedPassword,
        currentPwdHash: activeUser.password,
      })
      if (!passwordMatches) {
        return null
      }
      return activeUser
    },
)

QMModule(module)
