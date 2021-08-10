import { GraphNodeIdentifier } from '@moodlenet/common/lib/content-graph/types/node'
import { documentByNodeIdSlug } from './helpers'

export const getAqlNodeByGraphNodeIdentifier = (identifier: GraphNodeIdentifier) => {
  const { _type } = identifier
  if ('_slug' in identifier) {
    return documentByNodeIdSlug(identifier)
  } else {
    const { _permId } = identifier
    return `DOCUMENT("${_type}/${_permId}")`
  }
}
