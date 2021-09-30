import { Assumptions } from '@moodlenet/common/lib/content-graph/bl/graph-lang'
import { GraphEdge, GraphEdgeType } from '@moodlenet/common/lib/content-graph/types/edge'
import { GraphNodeIdentifier } from '@moodlenet/common/lib/content-graph/types/node'
import { omit } from '@moodlenet/common/lib/utils/object'
import { DistOmit } from '@moodlenet/common/lib/utils/types'
import { aq, aqlstr } from '../../../../../lib/helpers/arango/query'
import { graphOperators } from '../../bl/graphOperators'
import { AqlGraphEdge, AqlGraphEdgeByType } from '../../types'

export const createEdgeQ = <Type extends GraphEdgeType>({
  edge,
  from,
  to,
  assumptions,
}: {
  edge: GraphEdge<Type>
  from: GraphNodeIdentifier
  to: GraphNodeIdentifier
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
  const q = aq<AqlGraphEdgeByType<Type>>(`
    let fromNode = ${graphOperators.graphNode(from)}
    let toNode = ${graphOperators.graphNode(to)}
    
    let newedge = ${aqlstr(aqlEdge)}

    FILTER ${aqlAssumptions}

    INSERT MERGE(
      ${aqlstr(aqlEdge)},
      {
        _from: fromNode._id,
        _fromType:fromNode._type,
        _to: toNode._id,
        _toType:toNode._type
      }
    )
    
    into ${edgeType}

    return NEW
  `)
  console.log('**', q)
  return q
}

// import { EdgeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
// import { BLRule } from '@moodlenet/common/lib/content-graph/types/common'
// import { Id, nodeTypeFromCheckedId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
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
