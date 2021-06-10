import { EdgeType, NodeType } from '../../../../../../graphql/types.node'
import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { setupSearchView } from './0.0.1/setupSearchView'

const nodes: NodeType[] = ['Profile', 'Collection', 'Resource', 'SubjectField']
const edges: EdgeType[] = ['Contains', 'Likes', 'Follows', 'Created', 'Edited', 'AppliesTo']

const init_0_0_1: VersionUpdater = {
  async initialSetUp({ db }) {
    await nodes.map(async nodeCollName => {
      console.log(`creating node collection ${nodeCollName} `)
      const collection = await db.createCollection(nodeCollName)
      return collection
    })
    await edges.map(async edgeCollName => {
      console.log(`creating edge collection ${edgeCollName} `)
      const edgeCollection = await db.createEdgeCollection(edgeCollName)
      return edgeCollection
    })
    await setupSearchView({ db })
  },
}

module.exports = init_0_0_1
