import { ActiveUser } from '../../../adapters/user-auth/arangodb/types'
import { QMModule, QMQuery } from '../../../lib/qmino'
import { PasswordVerifier } from '../../../types'

export type Adapter = {
  getUserSessionByUsername(_: { username: string }): Promise<ActiveUser | null>
  verifyPassword: PasswordVerifier
}
export type Input = { username: string; matchPassword: string | false }
export const getByUsername = QMQuery(
  ({ username, matchPassword }: Input) => async ({ getUserSessionByUsername, verifyPassword }: Adapter) => {
    const activeUser = await getUserSessionByUsername({ username })
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
