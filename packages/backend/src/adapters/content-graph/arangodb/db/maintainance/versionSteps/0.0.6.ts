import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { MNStaticEnv } from '../../../../../../lib/types'
// import { setIsAdminInProfiles } from './0.0.6/setIsAdminInProfiles'

const v_0_0_6: VersionUpdater<MNStaticEnv> = {
  async pullUp(/*{ db  , ctx: { domain }  }*/) {
    // await setIsAdminInProfiles({ db })
  },
  async pushDown() {
    throw new Error(`v_0_0_6 pushDown not implemented`)
  },
}

module.exports = v_0_0_6
