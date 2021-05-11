import { ActiveUser } from '../../adapters/user-auth/arangodb/types'
import { QMModule, QMQuery } from '../../lib/qmino'
import { PasswordVerifier } from '../../types'

export type Adapter = {
  getActiveUserByUsername(_: { username: string }): Promise<ActiveUser | null>
  verifyPassword: PasswordVerifier
}
export type Input = { username: string; matchPassword: string | false }
export const getActiveByUsername = QMQuery(
  ({ username, matchPassword }: Input) => async ({ getActiveUserByUsername, verifyPassword }: Adapter) => {
    const activeUser = await getActiveUserByUsername({ username })
    if (!activeUser) {
      return null
    }
    if (matchPassword === false) {
      return activeUser
    }
    const passwordMatch = await verifyPassword({ pwdhash: activeUser.password, pwd: matchPassword })
    if (!passwordMatch) {
      return null
    }
    return activeUser
  },
)

QMModule(module)
