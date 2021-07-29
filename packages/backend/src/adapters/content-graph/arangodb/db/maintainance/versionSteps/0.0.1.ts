import { GraphEdgeType } from '@moodlenet/common/lib/content-graph/types/edge'
import { GraphNodeType } from '@moodlenet/common/lib/content-graph/types/node'
import { newGlyphPermId } from '@moodlenet/common/lib/utils/content-graph/slug-id'
import { /* rootUser, */ getRootUser, localOrganizationData } from '../../../../../../initialData/content'
import { getIscedfields } from '../../../../../../initialData/ISCED/Fields/Iscedfields'
import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { justExecute } from '../../../../../../lib/helpers/arango/query'
import { MNStaticEnv } from '../../../../../../lib/types'
import { createNodeQ } from '../../../functions/createNode'
import { setupSearchView } from './0.0.1/setupSearchView'

const nodes: GraphNodeType[] = ['Profile', 'Collection', 'Resource', 'Iscedf', 'Organization', 'OpBadge']
const edges: GraphEdgeType[] = ['Created', 'HasOpBadge', 'Contains', 'Follows', 'Pinned']

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

    const localOrg = localOrganizationData({ domain })

    await justExecute(
      createNodeQ({
        node: {
          _type: 'Organization',
          _permId: localOrg._permId,
          _slug: localOrg._slug,
          color: localOrg.color,
          domain: localOrg.domain,
          intro: localOrg.intro,
          logo: localOrg.logo,
          name: localOrg.name,
        },
        status: 'Active',
      }),
      db,
    )
    const rootUser = getRootUser({ domain })
    console.log(`creating rootUser profile`)
    await justExecute(
      createNodeQ({
        node: {
          _slug: `__root__`,
          _authId: rootUser.rootAuthId,
          _permId: rootUser.rootPermId,
          _type: 'Profile',
          avatar: null,
          bio: '',
          name: 'ROOT',
          firstName: null,
          image: null,
          lastName: null,
          location: null,
          siteUrl: null,
        },
        status: 'Active',
      }),
      db,
    ).catch(e => {
      console.log({ e, name: 'rootUser' })
      throw e
    })

    const iscedfields = getIscedfields()
    await Promise.all(
      iscedfields.map(async subj_field_data => {
        console.log(`creating subject ${subj_field_data.name} ${subj_field_data.iscedCode}`)
        await justExecute(
          createNodeQ({
            node: {
              _permId: newGlyphPermId(),
              _slug: subj_field_data._slug,
              _type: 'Iscedf',
              codePath: subj_field_data.codePath,
              description: subj_field_data.description,
              iscedCode: subj_field_data.iscedCode,
              image: subj_field_data.image,
              name: subj_field_data.name,
              thumbnail: subj_field_data.thumbnail,
            },
            status: 'Active',
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
