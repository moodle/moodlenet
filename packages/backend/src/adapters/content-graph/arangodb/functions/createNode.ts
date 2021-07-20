import { NodeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Id, IdKey } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { createdByAtPatch, toDocumentEdgeOrNode } from './helpers'
import { DocumentNodeDataByType } from './types'

export const createNodeQ = <Type extends NodeType>({
  data,
  nodeType,
  key,
  domain,
  creatorProfileId,
}: {
  key: IdKey
  domain?: string
  nodeType: Type
  data: DocumentNodeDataByType<Type>
  creatorProfileId: Id
}) => {
  const newnode = { ...data, _domain: domain && { _id: `Domain/${domain}` }, _key: key, __typename: nodeType }
  const q = `
    let newnode = ${createdByAtPatch(newnode, creatorProfileId)}

    INSERT newnode into ${nodeType}

    return ${toDocumentEdgeOrNode('NEW')}
  `
  return q
}
