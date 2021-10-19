import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { MNStaticEnv } from '../../../../../../lib/types'
import { refactorResourceTypes } from './0.0.4/refactorResourceTypes'

const v_0_0_4: VersionUpdater<MNStaticEnv> = {
  async pullUp({ db /* , ctx: { domain } */ }) {
    await refactorResourceTypes({ db })
  },
  async pushDown() {
    throw new Error(`v_0_0_4 pushDown not implemented`)
  },
}

module.exports = v_0_0_4
