import { getProfileIdByUsername } from '@moodlenet/common/lib/utils/auth/helpers'
import { EdgeType, NodeType } from '../../../../../../graphql/types.node'
import { initialProfiles } from '../../../../../../initialData/content-graph/content'
import { iscedfields } from '../../../../../../initialData/ISCED/Fields/Iscedfields'
import { SystemSessionEnvUser } from '../../../../../../lib/auth/env'
import { justExecute } from '../../../../../../lib/helpers/arango'
import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { MNStaticEnv } from '../../../../../../lib/types'
import { createNodeQ } from '../../../functions/createNode'
import { setupSearchView } from './0.0.1/setupSearchView'

const nodes: NodeType[] = ['Profile', 'Collection', 'Resource', 'Iscedfield']
const edges: EdgeType[] = ['Contains', 'Likes', 'Follows', 'Created', 'Edited', 'AppliesTo']

const init_0_0_1: VersionUpdater<MNStaticEnv> = {
  async initialSetUp({ db, ctx: { domain } }) {
    await nodes.map(async nodeCollName => {
      console.log(`creating node collection ${nodeCollName}`)
      const collection = await db.createCollection(nodeCollName)
      return collection
    })
    await edges.map(async edgeCollName => {
      console.log(`creating edge collection ${edgeCollName}`)
      const edgeCollection = await db.createEdgeCollection(edgeCollName)
      return edgeCollection
    })

    const creatorProfileId = getProfileIdByUsername(SystemSessionEnvUser.name)

    await Promise.all(
      initialProfiles({ domain }).map(async profileData => {
        console.log(`creating profile ${profileData.name}`)
        await justExecute(
          createNodeQ({
            creatorProfileId,
            nodeType: 'Profile',
            data: profileData,
            key: profileData.name,
          }),
          db,
        ).catch(e => {
          console.log({ e, name: profileData.name })
          throw e
        })
      }),
    )

    await Promise.all(
      iscedfields.map(async subj_field_data => {
        console.log(`creating subject ${subj_field_data.name} ${subj_field_data.code}`)
        await justExecute(
          createNodeQ({ nodeType: 'Iscedfield', key: subj_field_data.code, data: subj_field_data, creatorProfileId }),
          db,
        ).catch(e => {
          console.log({ e, name: subj_field_data.name })
          throw e
        })
      }),
    )

    await setupSearchView({ db })
  },
}

module.exports = init_0_0_1
