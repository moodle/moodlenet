import { NodeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Id, IdKey } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { createNodeMergePatch, toDocumentEdgeOrNode } from './helpers'
import { DocumentNodeDataByType } from './types'

export const createNodeQ = <Type extends NodeType>({
  data,
  nodeType,
  key,
  organization,
  creatorProfileId,
}: {
  key: IdKey
  organization?: string
  nodeType: Type
  data: DocumentNodeDataByType<Type>
  creatorProfileId: Id
}) => {
  const newnode = {
    ...data,
    _organization: organization && { _id: `Organization/${organization}` },
    _key: key,
    __typename: nodeType,
  }
  const q = `
    let newnode = ${createNodeMergePatch({ doc: newnode, byId: creatorProfileId, orgId: organization })}

    INSERT newnode into ${nodeType}

    return ${toDocumentEdgeOrNode('NEW')}
  `
  console.log(q)
  return q
}
