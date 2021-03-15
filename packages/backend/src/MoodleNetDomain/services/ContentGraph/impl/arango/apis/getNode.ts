import { IdKey } from '@moodlenet/common/lib/utils/content-graph'
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
  Type extends GQL.NodeType = GQL.NodeType
>({
  // ctx,
  _key,
  nodeType,
}: {
  // ctx,
  _key: IdKey
  nodeType: Type
}) => {
  const node = await getNode<Type>({ _key, nodeType, persistence })
  return node
}
