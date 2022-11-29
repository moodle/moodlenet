import { getOneResult } from '../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../lib/plug'
import { getLatestConfigAdapter } from '../../../../ports/user-auth/adapters'
import { getLatestConfigQ } from '../queries/config'
import { UserAuthDB } from '../types'
export const getLatestConfig =
  (db: UserAuthDB): SockOf<typeof getLatestConfigAdapter> =>
  async () => {
    const q = getLatestConfigQ()
    const cfg = await getOneResult(q, db)
    if (!cfg) {
      throw new Error(`No AuthConfig in DB!`)
    }
    return cfg
  }
// saveConfig: async cfg => {
//   const q = saveConfigQ(cfg)
//   await getOneResult(q, db)
//   return null
// }
