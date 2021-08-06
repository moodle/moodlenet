import { GraphEdgeByType, GraphEdgeType } from '@moodlenet/common/lib/content-graph/types/edge'
import { GraphNodeIdentifier } from '@moodlenet/common/lib/content-graph/types/node'
import { omit } from '@moodlenet/common/lib/utils/object'
import { DistOmit } from '@moodlenet/common/lib/utils/types'
import { aq, aqlstr } from '../../../../lib/helpers/arango/query'
import { AqlGraphEdge, AqlGraphEdgeByType } from '../types'
import { documentBySlugType } from './helpers'

export const getAqlNodeByGraphNodeIdentifier = (identifier: GraphNodeIdentifier) => {
  const { _type } = identifier
  if ('_slug' in identifier) {
    const { _slug } = identifier
    return documentBySlugType({ _type, _slug })
  } else {
    const { _permId } = identifier
    return `DOCUMENT("${_type}/${_permId}")`
  }
}

export const createEdgeQ = <Type extends GraphEdgeType>({
  edge,
  from,
  to,
}: {
  edge: GraphEdgeByType<Type>
  from: GraphNodeIdentifier
  to: GraphNodeIdentifier
}) => {
  const edgeType = edge._type
  const aqlEdge: DistOmit<
    AqlGraphEdge,
    '_key' | '_from' | '_to' | '_created' | '_rev' | '_id' | '_fromType' | '_toType'
  > = {
    _key: edge.id,
    ...omit(edge, ['id']),
  }

  const q = aq<AqlGraphEdgeByType<Type>>(`
    let fromNode = ${getAqlNodeByGraphNodeIdentifier(from)}
    let toNode = ${getAqlNodeByGraphNodeIdentifier(to)}
    
    let newedge = ${aqlstr(aqlEdge)}

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
  // console.log(q)
  return q
}

// import { EdgeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
// import { BLRule } from '@moodlenet/common/lib/lib/bl/common'
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
