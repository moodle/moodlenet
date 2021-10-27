import { GraphOperators } from '@moodlenet/common/lib/content-graph/bl/graph-lang/graphOperators'
import { aqlstr } from '../../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../../lib/plug'
import { getGraphOperatorsAdapter } from '../../../../../ports/content-graph/common'
import { aqlGraphEdge2GraphEdge, aqlGraphNode2GraphNode, graphNode2AqlId } from '../../aql/helpers'
import { _ } from './_'

export const getGraphOperators: SockOf<typeof getGraphOperatorsAdapter> = async () => graphOperators
export const graphOperators: GraphOperators = {
  // edgeType: edgeType => ` ${edgeType} ` as BV<GraphEdgeType>,
  // nodeType: nodeType => ` ${nodeType} ` as BV<GraphNodeType>,
  graphNode: identifier => {
    // Identifier = { _authId } | { _permId } | { _slug } | AqlGraphNode
    if (!identifier) {
      return _('null')
    }
    if ('_permId' in identifier) {
      const { _permId, _type } = identifier
      return _(`${aqlGraphNode2GraphNode(`DOCUMENT("${_type}/${_permId}")`)}`)
    }

    const [idProp, propVal] =
      '_slug' in identifier
        ? (['_slug', identifier._slug] as const)
        : '_authId' in identifier
        ? (['_authId', identifier._authId] as const)
        : (null as never)

    return _(
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
      return _('null')
    }
    const { _type, id } = identifier
    return _(`${aqlGraphEdge2GraphEdge(`DOCUMENT("${_type}/${id}")`)}`)
  },
  isCreator: ({ authNode, ofNode }) => _<boolean>(`${authNode}._authId == ${ofNode}._creatorAuthId`),
  isPublished: node => _<boolean>(`${node}._published == true`),
  // isCreator: ({ authNode, ofNode }) => {
  //   const Created: EdgeType = 'Created'
  //   return _<boolean>(`${authNode}._authId && ${ofNode} ? ( LENGTH(
  //     FOR e in ${Created}
  //       FILTER  e._authId == ${authNode}._authId
  //           &&  e._to == ${graphNode2AqlId(ofNode)}
  //       LIMIT 1
  //     RETURN e
  //   ) == 1 ) : false`)
  // },
  isSameNode: (a, b) => _<boolean>(`${graphNode2AqlId(a)} == ${graphNode2AqlId(b)}`),
  // nodeId(nodeId) {
  //   return _(getAqlNodeByGraphNodeIdentifierQ(nodeId))
  // },
  // authId(authId, type) {
  //   return _(authNodeByAuthIdQ({ authId, type }))
  // },
}
