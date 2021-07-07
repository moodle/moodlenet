import { getOneResult } from '../../../../lib/helpers/arango'
import { Adapter } from '../../../../ports/user-auth/config'
import { getLatestConfigQ, saveConfigQ } from '../queries/config'
import { UserAuthConfig, UserAuthDB } from '../types'
export const getConfigAdapter = ({ db }: { db: UserAuthDB }): Adapter => ({
  getLatestConfig: async () => {
    const q = getLatestConfigQ()
    const cfg = await getOneResult(q, db)
    return cfg as UserAuthConfig
  },
  saveConfig: async cfg => {
    const q = saveConfigQ(cfg)
    await getOneResult(q, db)
    return null
  },
})
