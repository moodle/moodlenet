import { rootUserProfile } from '@moodlenet/common/lib/content-graph/initialData/content'
import { DefaultConfig } from '@moodlenet/common/lib/content-graph/initialData/user-auth/defaultConfig'
import { DistOmit } from '@moodlenet/common/lib/utils/types'
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
  async initialSetUp({ db /* ctx: { domain }  */ }) {
    const rootEmail = process.env.ROOT_EMAIL ?? ''
    if (!EMAILREGEX.test(rootEmail)) {
      throw new Error(`User Auth setup: need a env ROOT_EMAIL to be a valid email`)
    }
    console.log(`creating user-auth collection ${CONFIG}`)
    await db.createCollection(CONFIG)
    await justExecute(saveConfigQ(DefaultConfig), db)

    console.log(`creating user-auth collection ${USER}`)
    await db.createCollection(USER)

    const password = `---no-root-password-set---${Math.random().toString(36).substr(2)}`
    await justExecute(
      createNewUserQ({
        ...rootUserActive,
        email: rootEmail,
        password,
      }),
      db,
    )
  },
}

module.exports = init_0_0_1

// http://emailregex.com/
const EMAILREGEX =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
