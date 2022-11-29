import { getOneResult } from '../../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../../lib/plug'
import { adapter } from '../../../../../ports/content-graph/node/del'
import { cleanupBrokenEdges } from '../../aql/helpers'
import { deleteNodeQ } from '../../aql/writes/delNode'
import { ContentGraphDB } from '../../types'
import { ARANGO_GRAPH_OPERATORS } from '../bl/graphOperators'

const { graphNode } = ARANGO_GRAPH_OPERATORS
export const arangoDelNodeAdapter =
  (db: ContentGraphDB): SockOf<typeof adapter> =>
  async ({ assertions, nodeId }) => {
    const q = deleteNodeQ({ nodeId: graphNode(nodeId), type: nodeId._type, assertions })
    const result = await getOneResult(q, db)
    if (result) {
      cleanupBrokenEdges(db)
    }
    return result as any
  }
