import { GraphNode } from '@moodlenet/common/dist/content-graph/types/node'
import { aqlstr } from '../../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../../lib/plug'
import { graphOperators, GraphOperators } from '../../../../../ports/content-graph/graph-lang/graph'
import { aqlGraphEdge2GraphEdge, aqlGraphNode2GraphNode, graphNode2AqlId } from '../../aql/helpers'
import { _aqlBv } from './baseOperators'

export const arangoGraphOperators: SockOf<typeof graphOperators> = async () => ARANGO_GRAPH_OPERATORS
export const ARANGO_GRAPH_OPERATORS: GraphOperators = {
  graphNode: identifier => {
    if (!identifier) {
      return _aqlBv('null')
    }
    if ('_permId' in identifier) {
      const { _permId, _type } = identifier
      return _aqlBv(`${aqlGraphNode2GraphNode(`DOCUMENT("${_type}/${_permId}")`)}`)
    }

    const { _slug, _type } = identifier
    return _aqlBv(
      `(
      FOR opGraphNode IN ${_type}
        FILTER opGraphNode._slug == ${aqlstr(_slug)}
        LIMIT 1
      return ${aqlGraphNode2GraphNode('opGraphNode')}
      )[0]`,
    )
  },
  graphEdge: identifier => {
    if (!identifier) {
      return _aqlBv('null')
    }
    const { _type, id } = identifier
    return _aqlBv(`${aqlGraphEdge2GraphEdge(`DOCUMENT("${_type}/${id}")`)}`)
  },
  isCreator: ({ authNode, ofGlyph }) => _aqlBv<boolean>(`MATCHES( ${authNode}, ${ofGlyph}._creator )`),
  creatorOf: of => _aqlBv<GraphNode | null>(aqlGraphNode2GraphNode(`DOCUMENT(${graphNode2AqlId(`${of}._creator`)})`)),
  isPublished: glyph => _aqlBv<boolean>(`${glyph}._published == true`),
  isSameNode: (a, b) => _aqlBv<boolean>(`${graphNode2AqlId(a)} == ${graphNode2AqlId(b)}`),
}
