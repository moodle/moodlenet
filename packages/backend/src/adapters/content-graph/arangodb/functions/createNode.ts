import { NodeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Id, IdKey } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { ulidKey } from '../../../../lib/helpers/arango'
import { createdByAtPatch, toDocumentEdgeOrNode } from './helpers'
import { DocumentNodeDataByType } from './types'

export const createNodeQ = <Type extends NodeType>({
  data,
  nodeType,
  key,
  // assertions,
  creatorProfileId,
}: {
  key?: IdKey // remove this .. it was only necessary for profile creation on accuont activation, change the flow and disjoint the two
  nodeType: Type
  data: DocumentNodeDataByType<Type>
  creatorProfileId: Id
}) => {
  key = key ?? ulidKey()

  const newnode = { ...data, _key: key, __typename: nodeType }
  const q = `
    let newnode = ${createdByAtPatch(newnode, creatorProfileId)}

    INSERT newnode into ${nodeType}

    return ${toDocumentEdgeOrNode('NEW')}
  `
  return q
}
