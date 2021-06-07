import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { DefaultConfig } from '../../../../defaultConfig'
import { CONFIG, USER } from '../../../types'

const init_0_0_1: VersionUpdater = {
  async initialSetUp({ db }) {
    console.log(`creating node collection ${USER} `)
    await db.createCollection(USER)
    const configCollection = await db.createCollection(CONFIG)
    await configCollection.save(DefaultConfig)
  },
}

module.exports = init_0_0_1
