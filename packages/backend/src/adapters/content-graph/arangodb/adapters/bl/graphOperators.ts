import { aqlstr } from '../../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../../lib/plug'
import { graphOperators, GraphOperators } from '../../../../../ports/content-graph/graph-lang/graph'
import { aqlGraphEdge2GraphEdge, aqlGraphNode2GraphNode, graphNode2AqlId } from '../../aql/helpers'
import { _aqlBv } from './bv'

export const arangoGraphOperators: SockOf<typeof graphOperators> = async () => ARANGO_GRAPH_OPERATORS
export const ARANGO_GRAPH_OPERATORS: GraphOperators = {
  // edgeType: edgeType => ` ${edgeType} ` as BV<GraphEdgeType>,
  // nodeType: nodeType => ` ${nodeType} ` as BV<GraphNodeType>,
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
        : (null as never)

    return _aqlBv(
      `(
      FOR graphNode IN ${identifier._type}
        FILTER graphNode[${aqlstr(idProp)}] == ${aqlstr(propVal)}
        LIMIT 1
      return ${aqlGraphNode2GraphNode('graphNode')}
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
  isCreator: ({ authNode, ofGlyph: ofNode }) =>
    _aqlBv<boolean>(`${ofNode}._creator == { _type:${authNode}._type, _authKey:${authNode}._authKey }`),
  isPublished: node => _aqlBv<boolean>(`${node}._published == true`),
  // isCreator: ({ authNode, ofNode }) => {
  //   const Created: EdgeType = 'Created'
  //   return _<boolean>(`${authNode}._authKey && ${ofNode} ? ( LENGTH(
  //     FOR e in ${Created}
  //       FILTER  e._authKey == ${authNode}._authKey
  //           &&  e._to == ${graphNode2AqlId(ofNode)}
  //       LIMIT 1
  //     RETURN e
  //   ) == 1 ) : false`)
  // },
  isSameNode: (a, b) => _aqlBv<boolean>(`${graphNode2AqlId(a)} == ${graphNode2AqlId(b)}`),
  // nodeId(nodeId) {
  //   return _(getAqlNodeByGraphNodeIdentifierQ(nodeId))
  // },
  // authId(authId, type) {
  //   return _(authNodeByAuthIdQ({ authId, type }))
  // },
}
