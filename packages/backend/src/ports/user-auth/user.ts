import { QMModule, QMQuery } from '../../lib/qmino'
import { ActiveUser } from './types'

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
