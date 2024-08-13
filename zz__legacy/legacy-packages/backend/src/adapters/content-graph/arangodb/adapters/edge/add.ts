import { isArangoError } from 'arangojs/error'
import { getOneResult } from '../../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../../lib/plug'
import { adapter } from '../../../../../ports/content-graph/edge/add'
import { aqBV } from '../../aql/helpers'
import { getEdgeByNodesQ } from '../../aql/queries/getEdge'
// import { getAqlNodeByGraphNodeIdentifierQ } from '../aql/queries/getNode'
import { createEdgeQ } from '../../aql/writes/addEdge'
import { ContentGraphDB } from '../../types'
import { ARANGO_GRAPH_OPERATORS } from '../bl/graphOperators'
const { graphNode } = ARANGO_GRAPH_OPERATORS

export const arangoAddEdgeAdapter =
  (db: ContentGraphDB): SockOf<typeof adapter> =>
  async ({ edge, from, to, assertions }) => {
    type ET = typeof edge._type
    const fromBV = graphNode(from)
    const toBV = graphNode(to)

    const q = createEdgeQ<ET>({
      edge,
      from: fromBV,
      to: toBV,
      assertions,
    })

    const result = await getOneResult(q, db).catch(async e => {
      if (!(isArangoError(e) && [1210, 1200].includes(e.errorNum))) {
        throw e
      }
      const existingEdgeQ = getEdgeByNodesQ({
        edgeType: edge._type,
        from: fromBV,
        to: toBV,
      })
      const existingEdge = await getOneResult(aqBV(existingEdgeQ), db)

      return existingEdge as any
    })

    return result
  }
