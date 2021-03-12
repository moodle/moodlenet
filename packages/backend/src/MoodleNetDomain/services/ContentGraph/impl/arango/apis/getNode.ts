import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { LookupWorker } from '../../../../../../lib/domain/wrk'
import * as GQL from '../../../ContentGraph.graphql.gen'
import { getNode } from '../functions/getNode'
import { MoodleNetArangoContentGraphSubDomain } from '../MoodleNetArangoContentGraphSubDomain'
import { Persistence } from '../types'

export const getNodeWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoContentGraphSubDomain, 'ContentGraph.Node.ById'> => async <
  Type extends GQL.Node = GQL.Node
>({
  // ctx,
  _id,
}: {
  // ctx,
  _id: Id
}) => {
  const node = await getNode<Type>({ _id, persistence })
  return node
}
