import { QMModule, QMQuery } from '../../lib/qmino'
import { UserAuthConfig } from './types'

export type Adapter = {
  getLatestConfig(): Promise<UserAuthConfig>
  saveConfig(_: UserAuthConfig): Promise<unknown>
}
export const getLatest = QMQuery(() => async ({ getLatestConfig }: Adapter) => {
  const latestConfig = await getLatestConfig()
  return latestConfig
})

// export const save = QMCommand(
//   () =>
//     async ({ saveConfig }: Adapter) => {
//       await saveConfig(cfg)
//       return true
//     },
// )

QMModule(module)
