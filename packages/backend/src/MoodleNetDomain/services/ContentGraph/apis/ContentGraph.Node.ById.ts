import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { getContentGraphPersistence } from '../ContentGraph.env'
import { Node } from '../ContentGraph.graphql.gen'

export const NodeByIdApiHandler = async <N extends Node>({ _id }: { _id: Id }) => {
  const { findNode } = await getContentGraphPersistence()
  const node = await findNode<N>({
    _id,
  })
  return { node }
}
