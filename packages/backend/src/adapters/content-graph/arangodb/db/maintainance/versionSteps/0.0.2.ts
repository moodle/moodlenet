import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { MNStaticEnv } from '../../../../../../lib/types'
import { createLikeEdgeCollections } from './0.0.2/createLikeEdgeCollections'

const v_0_0_2: VersionUpdater<MNStaticEnv> = {
  async pullUp({ db /* , ctx: { domain } */ }) {
    await createLikeEdgeCollections({ db })
  },
  async pushDown() {
    throw new Error(`v_0_0_2 pushDown not implemented`)
  },
}

module.exports = v_0_0_2
