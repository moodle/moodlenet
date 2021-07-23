import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { MNStaticEnv } from '../../../../../../lib/types'
import { redefineSearchView } from './0.0.3/redefineSearchView'

const init_0_0_3: VersionUpdater<MNStaticEnv> = {
  async pullUp({ db }) {
    await redefineSearchView({ db })
  },
  async pushDown() {
    throw new Error('not implemented')
  },
}

module.exports = init_0_0_3
