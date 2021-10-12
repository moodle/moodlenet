import { Assumptions, BV } from 'my-moodlenet-common/lib/content-graph/bl/graph-lang'
import { GraphEdge, GraphEdgeType } from 'my-moodlenet-common/lib/content-graph/types/edge'
import { GraphNode } from 'my-moodlenet-common/lib/content-graph/types/node'
import { omit } from 'my-moodlenet-common/lib/utils/object'
import { DistOmit } from 'my-moodlenet-common/lib/utils/types'
import { aq, aqlstr } from '../../../../../lib/helpers/arango/query'
import { AqlGraphEdge } from '../../types'
import { aqlGraphEdge2GraphEdge, graphNode2AqlId } from '../helpers'

export const createEdgeQ = <Type extends GraphEdgeType>({
  edge,
  from,
  to,
  issuer,
  assumptions,
}: {
  edge: GraphEdge<Type>
  from: BV<GraphNode | null>
  to: BV<GraphNode | null>
  issuer: BV<GraphNode | null>
  assumptions: Assumptions
}) => {
  const edgeType = edge._type
  const aqlEdge: DistOmit<
    AqlGraphEdge,
    '_key' | '_from' | '_to' | '_created' | '_rev' | '_id' | '_fromType' | '_toType'
  > = {
    _key: edge.id,
    ...omit(edge, ['id']),
  }

  const aqlAssumptions =
    Object.entries(assumptions)
      .map(([, assumption]) => assumption)
      .join(' && ') || 'true'
  const q = aq<GraphEdge<Type>>(`
    let fromNode = ${from}
    let toNode = ${to}
    let issuerNode = ${issuer}
    
    let newedge = ${aqlstr(aqlEdge)}

    FILTER ${aqlAssumptions}

    INSERT MERGE(
      newedge,
      {
        _from: ${graphNode2AqlId('fromNode')},
        _fromType:fromNode._type,
        _to: ${graphNode2AqlId('toNode')},
        _toType:toNode._type
      }
    )
    
    into ${edgeType}

    return ${aqlGraphEdge2GraphEdge('NEW')}
  `)
  console.log('**', q)
  return q
}

// import { EdgeType } from 'my-moodlenet-common/lib/graphql/types.graphql.gen'
// import { BLRule } from 'my-moodlenet-common/lib/content-graph/types/common'
// import { Id, nodeTypeFromCheckedId } from 'my-moodlenet-common/lib/utils/content-graph/id-key-type-guards'
// import { aq, aqlstr } from '../../../../lib/helpers/arango/query'
// import { DocumentEdgeByType, DocumentEdgeDataByType } from '../graphql/types'
// import { createEdgeMergePatch, isMarkDeleted, toDocumentEdgeOrNode } from './helpers'

// export const createEdgeQ = <Type extends EdgeType>({
//   data,
//   edgeType,
//   from,
//   to,
//   creatorId,
//   rule,
// }: {
//   edgeType: Type
//   data: DocumentEdgeDataByType<Type>
//   from: Id
//   to: Id
//   creatorId: Id
//   rule: BLRule
// }) => {
//   const fromType = nodeTypeFromCheckedId(from)
//   const toType = nodeTypeFromCheckedId(to)

//   const newedge = {
//     ...data,
//     __typename: edgeType,
//     _fromType: fromType,
//     _toType: toType,
//     _from: from,
//     _to: to,
//     _key: newGlyphKey(),
//   }

//   const q = aq<null | DocumentEdgeByType<typeof edgeType>>(`
//     let from = DOCUMENT(${aqlstr(from)})
//     let to = DOCUMENT(${aqlstr(to)})
//     let newedge = ${createEdgeMergePatch({ doc: newedge, byId: creatorId })}

//     FILTER !!from
//       AND !!to
//       AND !${isMarkDeleted('from')}
//       AND !${isMarkDeleted('to')}
//       AND ${rule}

//     INSERT newedge into ${edgeType}

//     return ${toDocumentEdgeOrNode('NEW')}
//   `)

//   // console.log(q)

//   return q
// }
