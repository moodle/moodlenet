import { isArangoError } from 'arangojs/error'
import { getOneResult } from '../../../../lib/helpers/arango/query'
import { CreateAdapter, DeleteEdgeAdapter } from '../../../../ports/content-graph/edge'
import { aqlGraphEdge2GraphEdge, getOneAQFrag } from '../aql/helpers'
import { getEdgeByNodesQ } from '../aql/queries/getEdge'
import { getAqlNodeByGraphNodeIdentifierQ } from '../aql/queries/getNode'
import { createEdgeQ } from '../aql/writes/createEdge'
import { deleteEdgeQ } from '../aql/writes/deleteEdge'
import { ContentGraphDB } from '../types'

export const createEdgeAdapter = (db: ContentGraphDB): CreateAdapter => ({
  storeEdge: async ({ edge, from, to }) => {
    type ET = typeof edge._type
    const q = createEdgeQ<ET>({ edge, from, to })

    const aqlResult = await getOneResult(q, db).catch(async e => {
      if (!(isArangoError(e) && e.errorNum === 1210)) {
        throw e
      }
      const existingEdgeQ = getEdgeByNodesQ({
        edge,
        from: getOneAQFrag(getAqlNodeByGraphNodeIdentifierQ(from)),
        to: getOneAQFrag(getAqlNodeByGraphNodeIdentifierQ(to)),
      })
      const existingEdge = await getOneResult(existingEdgeQ, db)

      return existingEdge
    })

    const result = aqlResult && aqlGraphEdge2GraphEdge<ET>(aqlResult)

    return result as any
  },
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
