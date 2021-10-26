import { BV } from '@moodlenet/common/lib/content-graph/bl/graph-lang'
import { GraphEdge, GraphEdgeType } from '@moodlenet/common/lib/content-graph/types/edge'
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

export const deleteBrokenEdgesQ = (edgeType: string) => {
  const q = aq<GraphEdge | null>(`
FOR e in ${edgeType}
  LET from = Document(e._from)
  LET to  = Document(e._to)
  FILTER !(from && to)
  REMOVE e IN ${edgeType} OPTIONS { ignoreErrors: true }
  RETURN ${aqlGraphEdge2GraphEdge('OLD')}
`)
  // console.log(q)
  return q
}
