import { DefaultConfig } from '../../../../../../initialData/user-auth/defaultConfig'
import initialUsers from '../../../../../../initialData/user-auth/initialUsers'
import { argonHashPassword } from '../../../../../../lib/auth/argon'
import { justExecute } from '../../../../../../lib/helpers/arango'
import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { MNStaticEnv } from '../../../../../../lib/types'
import { saveConfigQ } from '../../../queries/config'
import { createNewUserQ } from '../../../queries/createNewUser'
import { CONFIG, USER } from '../../../types'

const init_0_0_1: VersionUpdater<MNStaticEnv> = {
  async initialSetUp({ db, ctx: { domain } }) {
    console.log(`creating user-auth collection ${CONFIG}`)
    await db.createCollection(CONFIG)
    await justExecute(saveConfigQ(DefaultConfig), db)

    console.log(`creating user-auth collection ${USER}`)
    await db.createCollection(USER)
    await Promise.all(
      initialUsers({ domain }).map(async userData => {
        userData.password = await argonHashPassword({ pwd: userData.password })
        return justExecute(createNewUserQ(userData), db)
      }),
    )
  },
}

module.exports = init_0_0_1
