import { parseCheckedNodeId } from '../../../../utils/content-graph/id-key-type-guards'
import { CreateEdgeArgs } from './types'

export const Contains = ({
  from: collectionId,
  to: resourceId,
  userRole,
  profileId: userId,
  ops: { and, edgeExists, not, or, isCreator },
}: CreateEdgeArgs) => {
  const [fromType] = parseCheckedNodeId(collectionId)
  const [toType] = parseCheckedNodeId(resourceId)

  const legalBind = and(fromType === 'Collection', toType === 'Resource')
  const roleAdmitted = or(userRole === 'Admin', userRole === 'Editor', userRole === 'System')
  const edgeNotExistYet = not(edgeExists(collectionId, 'Contains', resourceId))

  const userIsCollectionCreator = isCreator(userId, collectionId)

  return and(legalBind, roleAdmitted, userIsCollectionCreator, edgeNotExistYet)
}
