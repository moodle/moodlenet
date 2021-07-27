import { GraphEdgeType } from '@moodlenet/common/lib/content-graph/types/edge'
import { BumbNodeStatus, GraphNodeType } from '@moodlenet/common/lib/content-graph/types/node'
import { /* rootUser, */ getRootUser, localOrganizationData } from '../../../../../../initialData/content'
import { iscedfields } from '../../../../../../initialData/ISCED/Fields/Iscedfields'
import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { justExecute } from '../../../../../../lib/helpers/arango/query'
import { MNStaticEnv } from '../../../../../../lib/types'
import { createNodeQ } from '../../../functions/createNode'
import { setupSearchView } from './0.0.1/setupSearchView'

const nodes: GraphNodeType[] = ['Profile', 'Collection', 'Resource', 'Iscedf', 'Organization']
const edges: GraphEdgeType[] = ['Created', 'HasOpBadge']

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
    const _bumpStatus: BumbNodeStatus = { date: Number(new Date()), status: 'Active' }

    const localOrg = localOrganizationData({ domain })
    await justExecute(
      createNodeQ({
        nodeType: 'Organization',
        data: {
          _bumpStatus: localOrg._bumpStatus,
          _slug: localOrg._slug,
          color: localOrg.color,
          domain: localOrg.domain,
          intro: localOrg.intro,
          logo: localOrg.logo,
          name: localOrg.name,
        },
      }),
      db,
    )
    const rootUser = getRootUser({ domain })
    console.log(`creating rootUser profile`)
    await justExecute(
      createNodeQ({
        nodeType: 'Profile',
        data: {
          _slug: rootUser.slug,
          _authId: rootUser.rootAuthId,
          _bumpStatus,
          avatar: null,
          bio: '',
          displayName: '',
          firstName: null,
          image: null,
          lastName: null,
          location: null,
          siteUrl: null,
        },
      }),
      db,
    ).catch(e => {
      console.log({ e, name: 'rootUser' })
      throw e
    })

    await Promise.all(
      iscedfields.map(async subj_field_data => {
        console.log(`creating subject ${subj_field_data.name} ${subj_field_data.iscedCode}`)
        await justExecute(
          createNodeQ({
            nodeType: 'Iscedf',
            data: {
              _bumpStatus,
              _slug: subj_field_data._slug,
              codePath: subj_field_data.codePath,
              description: subj_field_data.description,
              iscedCode: subj_field_data.iscedCode,
              image: subj_field_data.image,
              name: subj_field_data.name,
              thumbnail: subj_field_data.thumbnail,
            },
          }),
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
