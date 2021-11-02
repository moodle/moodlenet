import { GraphEdge } from '@moodlenet/common/dist/content-graph/types/edge'
import { aq } from '../../../../../lib/helpers/arango/query'
import { aqlGraphEdge2GraphEdge } from '../helpers'

export const deleteBrokenEdgesQ = (type: string) => {
  const q = aq<GraphEdge | null>(`
FOR e in ${type}
  LET from = Document(e._from)
  LET to  = Document(e._to)
  FILTER !(from && to)
  REMOVE e IN ${type} OPTIONS { ignoreErrors: true }
  RETURN ${aqlGraphEdge2GraphEdge('OLD')}
`)
  // console.log(q)
  return q
}
