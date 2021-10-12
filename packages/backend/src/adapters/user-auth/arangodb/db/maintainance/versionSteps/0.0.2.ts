import { DefaultConfig } from 'my-moodlenet-common/lib/content-graph/initialData/user-auth/defaultConfig'
import { pick } from 'my-moodlenet-common/lib/utils/object'
import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { aqlstr, justExecute } from '../../../../../../lib/helpers/arango/query'
import { MNStaticEnv } from '../../../../../../lib/types'
import { CONFIG } from '../../../types'

const db_0_0_2: VersionUpdater<MNStaticEnv> = {
  async pullUp({ db /* , ctx: { domain } */ }) {
    const DefaultConfigPatch = pick(DefaultConfig, ['recoverPasswordEmail', 'recoverPasswordEmailExpiresSecs'])
    const updateQuery = `
FOR config IN ${CONFIG}
  UPDATE config WITH ${aqlstr(DefaultConfigPatch)} IN ${CONFIG}
RETURN null`
    await justExecute(updateQuery, db)
  },
  async pushDown() {
    throw new Error('not implemented')
  },
}

module.exports = db_0_0_2
