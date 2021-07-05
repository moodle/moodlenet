import { DefaultConfig } from '../../../../../../initialData/user-auth/defaultConfig'
import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { CONFIG } from '../../../types'

const init_0_0_2: VersionUpdater = {
  async pullUp({ db }) {
    console.log(`creating default Config document`)
    const configCollection = await db.collection(CONFIG)
    configCollection.save(DefaultConfig)
  },

  async pushDown(/* { db } */) {
    throw new Error(`Not implemented`)
  },
}

module.exports = init_0_0_2
