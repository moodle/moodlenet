import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { traverseEdges } from '../functions/traverseEdges'
import { MoodleNetArangoContentGraphSubDomain } from '../MoodleNetArangoContentGraphSubDomain'
import { Persistence } from '../types'

export const traverseEdgesWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoContentGraphSubDomain, 'ContentGraph.Edge.Traverse'> => async ({
  edgeType,
  page,
  parentNodeId,
  inverse,
  targetNodeType,
}) => {
  return traverseEdges({ edgeType, inverse, page, parentNodeId, persistence, targetNodeType })
}
