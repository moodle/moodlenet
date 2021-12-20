import {
  getSetupLocalOrgazation,
  localOrg_authId,
} from '@moodlenet/common/dist/content-graph_2.0.0/initialData/content'
import { DefaultConfig } from '@moodlenet/common/dist/content-graph_2.0.0/initialData/user-auth/defaultConfig'
import { GraphNodeIdentifierAuth } from '@moodlenet/common/dist/content-graph_2.0.0/types/node'
import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { aqlstr, justExecute } from '../../../../../../lib/helpers/arango/query'
import { Status } from '../../../../../../ports/user-auth/types'
import { CONFIG, USER } from '../../../types'

// const rootUserActive: DistOmit<ActiveUser, 'email' | 'password' | 'id' | 'createdAt' | 'updatedAt'> = {
const rootUserActive: {
  authId: GraphNodeIdentifierAuth
  status: Status
} = {
  status: 'Active',
  authId: localOrg_authId,
}

const init_2_0_0: VersionUpdater = {
  async initialSetUp({ db }) {
    const orgEmail = process.env.SETUP_ORGANIZATION_EMAIL ?? ''
    if (!EMAILREGEX.test(orgEmail)) {
      throw new Error(`User Auth setup: need an env SETUP_ORGANIZATION_EMAIL to be a valid email`)
    }
    const org = getSetupLocalOrgazation()
    if (!org) {
      throw new Error(`SetupLocalOrgazation not set !`)
    }

    console.log(`creating user-auth collection ${CONFIG}`)
    await db.createCollection(CONFIG)
    await justExecute(
      `INSERT 
      ${aqlstr(DefaultConfig(org))}
      INTO ${CONFIG}
      RETURN null`,
      db,
    )

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
      `
    INSERT MERGE(
      ${aqlstr({
        ...rootUserActive,
        email: orgEmail,
        password,
      })},
      { 
        createdAt: DATE_NOW(),
        updatedAt: DATE_NOW()
      } 
    )

    INTO ${USER}
    RETURN MERGE( { id:NEW._key } , NEW )
  `,
      db,
    )
  },
}

module.exports = init_2_0_0

// http://emailregex.com/
const EMAILREGEX =
  // eslint-disable-next-line no-control-regex
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
