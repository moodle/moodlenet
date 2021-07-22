import { getProfileIdByUsername } from '@moodlenet/common/lib/utils/auth/helpers'
import { NodeType } from '../../../../../../graphql/types.node'
import { localOrganizationData } from '../../../../../../initialData/content-graph/content'
import { SystemSessionEnvUser } from '../../../../../../lib/auth/env'
import { justExecute } from '../../../../../../lib/helpers/arango'
import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { MNStaticEnv } from '../../../../../../lib/types'
import { createNodeQ } from '../../../functions/createNode'

const orgNodeType: NodeType = 'Organization'

const init_0_0_2: VersionUpdater<MNStaticEnv> = {
  async pullUp({ db, ctx: { domain } }) {
    await db.createCollection(orgNodeType)
    const creatorProfileId = getProfileIdByUsername(SystemSessionEnvUser.name)

    await justExecute(
      createNodeQ({
        nodeType: orgNodeType,
        key: 'local',
        data: localOrganizationData({ domain }),
        creatorProfileId,
      }),
      db,
    )
  },
  async pushDown() {
    throw new Error('not implemented')
  },
}

module.exports = init_0_0_2
