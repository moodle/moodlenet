import { ActiveUser } from '@moodlenet/common/lib/user-auth/types'
import { QMModule, QMQuery } from '../../lib/qmino'

export type Adapter = {
  getActiveUserByEmail(_: { email: string }): Promise<ActiveUser | null>
}
export type Input = { email: string }
export const getActiveByEmail = QMQuery(({ email }: Input) => async ({ getActiveUserByEmail }: Adapter) => {
  const activeUser = await getActiveUserByEmail({ email })
  if (!activeUser) {
    return null
  }
  return activeUser
})

QMModule(module)
