import { isArangoError } from 'arangojs/error'
import { getOneResult } from '../../../../lib/helpers/arango/query'
import { CreateAdapter, DeleteEdgeAdapter } from '../../../../ports/content-graph/edge'
import { aqBV, aqlGraphEdge2GraphEdge } from '../aql/helpers'
import { getEdgeByNodesQ } from '../aql/queries/getEdge'
// import { getAqlNodeByGraphNodeIdentifierQ } from '../aql/queries/getNode'
import { createEdgeQ } from '../aql/writes/createEdge'
import { deleteEdgeQ } from '../aql/writes/deleteEdge'
import { addEdgeOperators } from '../bl/addEdgeOperators'
import { baseOperators } from '../bl/baseOperators'
import { graphOperators } from '../bl/graphOperators'
import { ContentGraphDB } from '../types'

export const createEdgeAdapter = (db: ContentGraphDB): Omit<CreateAdapter, 'assumptionsMap'> => ({
  storeEdge: async ({ edge, from, to, assumptions }) => {
    type ET = typeof edge._type
    const q = createEdgeQ<ET>({ edge, from, to, assumptions })

    const aqlResult = await getOneResult(q, db).catch(async e => {
      if (!(isArangoError(e) && [1210, 1200].includes(e.errorNum))) {
        throw e
      }
      const existingEdgeQ = getEdgeByNodesQ({
        edgeType: edge._type,
        from: graphOperators.graphNode(from),
        to: graphOperators.graphNode(to),
      })
      const existingEdge = await getOneResult(aqBV(existingEdgeQ), db)

      return existingEdge
    })

    const result = aqlResult && aqlGraphEdge2GraphEdge<ET>(aqlResult)

    return result as any
  },
  addEdgeOperators,
  baseOperators,
  graphOperators,
  // ops: {
  //   ...graphOperators,
  //   ...baseOperators,
  // },
})

export const deleteEdgeAdapter = (db: ContentGraphDB): DeleteEdgeAdapter => ({
  deleteEdge: async ({ edge }) => {
    const q = deleteEdgeQ(edge)
    const result = await getOneResult(q, db)
    return !!result
  },
})
