import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { getNode } from '../functions/getNode'
import { MoodleNetArangoContentGraphSubDomain } from '../MoodleNetArangoContentGraphSubDomain'
import { Persistence } from '../types'

export const getNodeWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoContentGraphSubDomain, 'ContentGraph.Node.ById'> => async ({ ctx, _key, nodeType }) => {
  const node = await getNode({ _key, ctx, nodeType, persistence })
  return node
}
