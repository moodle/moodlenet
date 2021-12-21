import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { patchConfig } from './2.0.1/patchConfig'
import { setPermIdInUserAuthId } from './2.0.1/setPermIdInUserAuthId'

const init_2_0_1: VersionUpdater = {
  async pullUp({ db }) {
    await setPermIdInUserAuthId({ db })
    await patchConfig({ db })
  },
  pushDown() {
    throw new Error('not implemented')
  },
}

module.exports = init_2_0_1
