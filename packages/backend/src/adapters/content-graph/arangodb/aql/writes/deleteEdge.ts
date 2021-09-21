import { GraphEdgeIdentifier } from '@moodlenet/common/lib/content-graph/types/edge'
import { aq, aqlstr } from '../../../../../lib/helpers/arango/query'
import { AqlGraphEdge } from '../../types'

export const deleteEdgeQ = ({ _type, id }: GraphEdgeIdentifier) => {
  const q = aq<AqlGraphEdge>(`
    REMOVE { _key: ${aqlstr(id)} } IN ${_type} OPTIONS { ignoreErrors: true }

    RETURN OLD
  `)
  // console.log(q)
  return q
}
