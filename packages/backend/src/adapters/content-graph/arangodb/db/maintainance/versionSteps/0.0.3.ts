import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { MNStaticEnv } from '../../../../../../lib/types'
import { createBookmarkedEdgeCollections } from './0.0.3/createBookmarkedEdgeCollections'

const v_0_0_3: VersionUpdater<MNStaticEnv> = {
  async pullUp({ db /* , ctx: { domain } */ }) {
    await createBookmarkedEdgeCollections({ db })
  },
  async pushDown() {
    throw new Error(`v_0_0_3 pushDown not implemented`)
  },
}

module.exports = v_0_0_3
