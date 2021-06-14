import { Id, parseEdgeId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { useCallback, useMemo } from 'react'
import { CreateEdgeInput, EdgeType } from '../../graphql/pub.graphql.link'
import { useCreateEdgeMutation, useDeleteEdgeMutation } from './mutateEdge/mutateEdge.gen'

export const useMutateEdge = () => {
  const [_deleteEdge, deleteResult] = useDeleteEdgeMutation()
  const [_createEdge, createResult] = useCreateEdgeMutation()

  const deleteEdge = useCallback(
    ({ edgeId }: { edgeId: Id }) => {
      const { edgeType } = parseEdgeId(edgeId)
      return _deleteEdge({ variables: { input: { id: edgeId, edgeType } } })
    },
    [_deleteEdge],
  )

  const createEdge = useCallback(
    <E extends EdgeType>({ data, edgeType, from, to }: { edgeType: E; from: Id; to: Id; data: CreateEdgeInput[E] }) => {
      return _createEdge({ variables: { input: { edgeType, from, to, [edgeType]: data } } })
    },
    [_createEdge],
  )

  return useMemo(
    () => ({
      deleteEdge,
      deleteResult,
      createEdge,
      createResult,
    }),
    [createEdge, createResult, deleteEdge, deleteResult],
  )
}
