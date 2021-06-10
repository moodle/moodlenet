import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { CONFIG, USER } from '../../../types'

const init_0_0_1: VersionUpdater = {
  async initialSetUp({ db }) {
    console.log(`creating node collection ${USER}`)
    await db.createCollection(USER)

    console.log(`creating node collection ${CONFIG}`)
    await db.createCollection(CONFIG)
  },
}

module.exports = init_0_0_1
