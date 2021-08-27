import { rootUserProfile } from '@moodlenet/common/lib/content-graph/initialData/content'
import { DefaultConfig } from '@moodlenet/common/lib/content-graph/initialData/user-auth/defaultConfig'
import { DistOmit } from '@moodlenet/common/lib/utils/types'
import { argonHashPassword } from '../../../../../../lib/auth/argon'
import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { justExecute } from '../../../../../../lib/helpers/arango/query'
import { MNStaticEnv } from '../../../../../../lib/types'
import { ActiveUser } from '../../../../../../ports/user-auth/types'
import { saveConfigQ } from '../../../queries/config'
import { createNewUserQ } from '../../../queries/createNewUser'
import { CONFIG, USER } from '../../../types'

const rootUserActive: DistOmit<ActiveUser, 'email' | 'password' | 'id' | 'createdAt' | 'updatedAt'> = {
  status: 'Active',
  authId: rootUserProfile._authId,
}

const init_0_0_1: VersionUpdater<MNStaticEnv> = {
  async initialSetUp({ db, ctx: { domain } }) {
    console.log(`creating user-auth collection ${CONFIG}`)
    await db.createCollection(CONFIG)
    await justExecute(saveConfigQ(DefaultConfig), db)

    console.log(`creating user-auth collection ${USER}`)
    await db.createCollection(USER)

    const password = await argonHashPassword('root')
    await justExecute(
      createNewUserQ({
        ...rootUserActive,
        email: `root@${domain}`,
        password,
      }),
      db,
    )
  },
}

module.exports = init_0_0_1
