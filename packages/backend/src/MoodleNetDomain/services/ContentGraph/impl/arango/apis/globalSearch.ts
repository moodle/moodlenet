import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { globalSearch } from '../functions/globalSearch'
import { MoodleNetArangoContentGraphSubDomain } from '../MoodleNetArangoContentGraphSubDomain'
import { Persistence } from '../types'

export const globalSearchWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoContentGraphSubDomain, 'ContentGraph.GlobalSearch'> => async ({
  page,
  text,
  nodeTypes,
}) => {
  return globalSearch({ page, persistence, text, nodeTypes })
}
