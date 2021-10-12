import { BV } from 'my-moodlenet-common/lib/content-graph/bl/graph-lang'
import { GraphEdge, GraphEdgeType } from 'my-moodlenet-common/lib/content-graph/types/edge'
import { aq } from '../../../../../lib/helpers/arango/query'
import { aqlGraphEdge2GraphEdge } from '../helpers'

export const deleteEdgeQ = (edge: BV<GraphEdge | null>, edgeType: GraphEdgeType) => {
  const q = aq<GraphEdge | null>(`
    REMOVE { _key: ${edge}.id } IN ${edgeType} OPTIONS { ignoreErrors: true }

    RETURN ${aqlGraphEdge2GraphEdge('OLD')}
  `)
  // console.log(q)
  return q
}
