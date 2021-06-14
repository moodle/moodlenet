import { Id, parseNodeId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { useCallback, useMemo } from 'react'
import { CreateNodeInput, NodeType } from '../../graphql/pub.graphql.link'
import { useCreateNodeMutation, useDeleteNodeMutation } from './mutateNode/mutateNode.gen'

export const useMutateNode = () => {
  const [_deleteNode, deleteResult] = useDeleteNodeMutation()
  const [_createNode, createResult] = useCreateNodeMutation()

  const deleteNode = useCallback(
    ({ nodeId }: { nodeId: Id }) => {
      const { nodeType } = parseNodeId(nodeId)
      return _deleteNode({ variables: { input: { id: nodeId, nodeType } } })
    },
    [_deleteNode],
  )

  const createNode = useCallback(
    <N extends NodeType>({ data, nodeType }: { nodeType: N; data: CreateNodeInput[N] }) => {
      return _createNode({ variables: { input: { nodeType, [nodeType]: data } } })
    },
    [_createNode],
  )

  return useMemo(
    () => ({
      deleteNode,
      deleteResult,
      createNode,
      createResult,
    }),
    [createNode, createResult, deleteNode, deleteResult],
  )
}
