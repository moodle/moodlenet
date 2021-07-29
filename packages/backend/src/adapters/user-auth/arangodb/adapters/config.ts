import { getOneResult } from '../../../../lib/helpers/arango/query'
import { Adapter } from '../../../../ports/user-auth/config'
import { getLatestConfigQ, saveConfigQ } from '../queries/config'
import { UserAuthDB } from '../types'
export const getConfigAdapter = ({ db }: { db: UserAuthDB }): Adapter => ({
  getLatestConfig: async () => {
    const q = getLatestConfigQ()
    const cfg = await getOneResult(q, db)
    if (!cfg) {
      throw new Error(`No AuthConfig in DB!`)
    }
    return cfg
  },
  saveConfig: async cfg => {
    const q = saveConfigQ(cfg)
    await getOneResult(q, db)
    return null
  },
})
