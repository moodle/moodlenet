import { UserAuthConfig } from '../../adapters/user-auth/arangodb/types'
import { SessionEnv } from '../../lib/auth/types'
import { QMCommand, QMModule, QMQuery } from '../../lib/qmino'

export type Adapter = {
  getLatestConfig(): Promise<UserAuthConfig>
  saveConfig(_: UserAuthConfig): Promise<unknown>
}
export const getLatest = QMQuery(
  ({ sessionEnv: { user } }: { sessionEnv: SessionEnv }) =>
    async ({ getLatestConfig }: Adapter) => {
      if (!(user.role === 'Admin' || user.role === 'System')) {
        return false
      }
      const latestConfig = await getLatestConfig()
      return latestConfig
    },
)

export const save = QMCommand(
  ({ cfg, sessionEnv: { user } }: { cfg: UserAuthConfig; sessionEnv: SessionEnv }) =>
    async ({ saveConfig }: Adapter) => {
      if (!(user.role === 'Admin' || user.role === 'System')) {
        return false
      }
      await saveConfig(cfg)
      return true
    },
)

QMModule(module)
