import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { MoodleNetExecutionContext } from '../../../types'
import { getContentGraphPersistence } from '../ContentGraph.env'
import { Node } from '../ContentGraph.graphql.gen'

export const NodeByIdApiHandler = async <N extends Node>({ _id, ctx }: { _id: Id; ctx: MoodleNetExecutionContext }) => {
  const { getNode } = await getContentGraphPersistence()
  const node = await getNode<N>({
    _id,
    ctx,
  })
  return { node }
}
