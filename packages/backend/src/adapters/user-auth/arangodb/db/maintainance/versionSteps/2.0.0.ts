import { __initialLocalOrgAuthId } from '@moodlenet/common/dist/content-graph/initialData/content'
import { DefaultConfig } from '@moodlenet/common/dist/content-graph/initialData/user-auth/defaultConfig'
import { DistOmit } from '@moodlenet/common/dist/utils/types'
import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { justExecute } from '../../../../../../lib/helpers/arango/query'
import { ActiveUser } from '../../../../../../ports/user-auth/types'
import { saveConfigQ } from '../../../queries/config'
import { createNewUserQ } from '../../../queries/createNewUser'
import { CONFIG, USER } from '../../../types'

const rootUserActive: DistOmit<ActiveUser, 'email' | 'password' | 'id' | 'createdAt' | 'updatedAt'> = {
  status: 'Active',
  authId: __initialLocalOrgAuthId,
}

const init_2_0_0: VersionUpdater = {
  async initialSetUp({ db /* ctx: { domain }  */ }) {
    const orgEmail = process.env.SETUP_ORGANIZATION_EMAIL ?? ''
    if (!EMAILREGEX.test(orgEmail)) {
      throw new Error(`User Auth setup: need an env SETUP_ORGANIZATION_EMAIL to be a valid email`)
    }

    console.log(`creating user-auth collection ${CONFIG}`)
    await db.createCollection(CONFIG)
    await justExecute(saveConfigQ(DefaultConfig), db)

    console.log(`creating user-auth collection ${USER}`)
    const userCollection = await db.createCollection(USER)

    await userCollection.ensureIndex({
      type: 'hash',
      name: 'email',
      fields: ['email'],
      unique: true,
    })
    await userCollection.ensureIndex({
      type: 'hash',
      name: 'authId',
      fields: ['authId'],
      unique: true,
    })
    await userCollection.ensureIndex({
      type: 'hash',
      name: 'emailAuthId',
      fields: ['authId', 'email'],
      unique: true,
    })
    await userCollection.ensureIndex({
      type: 'persistent',
      name: 'authIdParts',
      fields: ['authId._type', 'authId._authKey'],
      unique: true,
    })
    console.log(`creating organization-user`)
    const password = `---no-organization-user-password-set---${Math.random().toString(36).substr(2)}`
    await justExecute(
      createNewUserQ({
        ...rootUserActive,
        email: orgEmail,
        password,
      }),
      db,
    )
  },
}

module.exports = init_2_0_0

// http://emailregex.com/
const EMAILREGEX =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
