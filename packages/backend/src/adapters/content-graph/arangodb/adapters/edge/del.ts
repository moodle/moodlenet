import { getOneResult } from '../../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../../lib/plug'
import { adapter } from '../../../../../ports/content-graph/edge/del'
import { delEdgeQ } from '../../aql/writes/delEdge'
import { ContentGraphDB } from '../../types'
import { ARANGO_GRAPH_OPERATORS } from '../bl/graphOperators'
const { graphEdge } = ARANGO_GRAPH_OPERATORS

export const arangoDelEdgeAdapter =
  (db: ContentGraphDB): SockOf<typeof adapter> =>
  async ({ assertions, edgeId }) => {
    const q = delEdgeQ({ edge: graphEdge(edgeId), type: edgeId._type, assertions })
    const result = await getOneResult(q, db)
    return !!result
  }
