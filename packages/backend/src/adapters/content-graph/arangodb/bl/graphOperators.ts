import { GraphOperators } from '@moodlenet/common/lib/content-graph/bl/graph-lang/graphOperators'
import { EdgeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { aqlstr } from '../../../../lib/helpers/arango/query'
import { aqlGraphEdge2GraphEdge, aqlGraphNode2GraphNode } from '../aql/helpers'
import { _ } from './baseOperators'

export const graphOperators: GraphOperators = {
  // edgeType: edgeType => ` ${edgeType} ` as BV<GraphEdgeType>,
  // nodeType: nodeType => ` ${nodeType} ` as BV<GraphNodeType>,
  graphNode: identifier => {
    // Identifier = { _authId } | { _permId } | { _slug } | AqlGraphNode
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
      FOR node IN ${identifier._type}
        FILTER node[${aqlstr(idProp)}] == ${aqlstr(propVal)}
        LIMIT 1
      return ${aqlGraphNode2GraphNode('node')}
      )[0]`,
    )
  },
  graphEdge: ({ _type, id }) => {
    return _(`${aqlGraphEdge2GraphEdge(`DOCUMENT("${_type}/${id}")`)}`)
  },
  isCreator: ({ authId, nodeId }) => {
    const Created: EdgeType = 'Created'
    return _<boolean>(`${authId} && ${nodeId} ? ( LENGTH(
      FOR e in ${Created}
        FILTER  e._authId == ${authId}._authId
                && e._to == ${nodeId}._id
        LIMIT 1
      RETURN e
    ) == 1 ) : false`)
  },
  // nodeId(nodeId) {
  //   return _(getAqlNodeByGraphNodeIdentifierQ(nodeId))
  // },
  // authId(authId, type) {
  //   return _(authNodeByAuthIdQ({ authId, type }))
  // },
}
