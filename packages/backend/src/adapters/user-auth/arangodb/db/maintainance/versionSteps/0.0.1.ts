import { getRootUser } from '../../../../../../initialData/content'
import { DefaultConfig } from '../../../../../../initialData/user-auth/defaultConfig'
import { argonHashPassword } from '../../../../../../lib/auth/argon'
import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { justExecute } from '../../../../../../lib/helpers/arango/query'
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

    const rootUser = getRootUser({ domain })
    const rootUserPassword = await argonHashPassword(rootUser.clearPassword)
    await justExecute(
      createNewUserQ({
        status: 'Active',
        email: rootUser.email,
        authId: rootUser.rootAuthId,
        password: rootUserPassword,
      }),
      db,
    )
  },
}

module.exports = init_0_0_1
