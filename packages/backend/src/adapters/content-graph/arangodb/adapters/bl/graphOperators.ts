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

    const [idProp, propVal] =
      '_slug' in identifier
        ? (['_slug', identifier._slug] as const)
        : '_authKey' in identifier
        ? (['_authKey', identifier._authKey] as const)
        : (null as never) //FIXME: either throw or return null bv

    return _aqlBv(
      `(
      FOR opGraphNode IN ${identifier._type}
        FILTER opGraphNode[${aqlstr(idProp)}] == ${aqlstr(propVal)}
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
  isPublished: glyph => _aqlBv<boolean>(`${glyph}._published == true`),
  isSameNode: (a, b) => _aqlBv<boolean>(`${graphNode2AqlId(a)} == ${graphNode2AqlId(b)}`),
}
