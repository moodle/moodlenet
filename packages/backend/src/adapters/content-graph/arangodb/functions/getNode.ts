import { NodeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { IdKey } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { aqlstr } from '../../../../lib/helpers/arango'
import { isMarkDeleted, toDocumentEdgeOrNode } from './helpers'

export const getNode = <Type extends NodeType = NodeType>({ nodeType, _key }: { _key: IdKey; nodeType: Type }) => {
  const q = `
    let node = Document(${aqlstr(`${nodeType}/${_key}`)})

    FILTER !${isMarkDeleted('node')}

    return ${toDocumentEdgeOrNode('node')}
  `
  return q
}
