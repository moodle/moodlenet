import { EdgeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Id, nodeTypeFromId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { aqlstr, ulidKey } from '../../../../lib/helpers/arango'
import { createdByAtPatch, isMarkDeleted, toDocumentEdgeOrNode } from './helpers'
import { DocumentEdgeDataByType } from './types'

export const createEdgeQ = <Type extends EdgeType>({
  data,
  edgeType,
  from,
  to,
  creatorProfileId,
}: {
  edgeType: Type
  data: DocumentEdgeDataByType<Type>
  from: Id
  to: Id
  creatorProfileId: Id
}) => {
  const fromType = nodeTypeFromId(from)
  const toType = nodeTypeFromId(to)

  const newedge = {
    ...data,
    __typename: edgeType,
    _fromType: fromType,
    _toType: toType,
    _from: from,
    _to: to,
    _key: ulidKey(),
  }

  const q = `
    let from = DOCUMENT(${aqlstr(from)})
    let to = DOCUMENT(${aqlstr(to)})
    let newedge = ${createdByAtPatch(newedge, creatorProfileId)}

    FILTER !!from 
      AND !!to 
      AND !${isMarkDeleted('from')}
      AND !${isMarkDeleted('to')} 

    INSERT newedge into ${edgeType}

    return ${toDocumentEdgeOrNode('NEW')}
  `
  return q
}
