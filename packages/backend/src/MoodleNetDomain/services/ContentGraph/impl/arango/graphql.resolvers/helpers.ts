import {
  CreateEdgeMutationError,
  CreateEdgeMutationErrorType,
  CreateNodeMutationError,
  CreateNodeMutationErrorType,
  Edge,
  Node,
} from '../../../ContentGraph.graphql.gen'

export const fakeUnshallowNodeForResolverReturnType = <N extends Node>(
  shallow: Pick<N, '_id'> & { __typename?: N['__typename'] },
): N => shallow as N
export const fakeUnshallowEdgeForResolverReturnType = <E extends Edge>(
  shallow: Pick<E, '_id'> & { __typename?: E['__typename'] },
): E => shallow as E

export const createNodeMutationError = (
  type: CreateNodeMutationErrorType,
  details: string | null = null,
): CreateNodeMutationError => ({
  __typename: 'CreateNodeMutationError',
  type,
  details,
})

export const createEdgeMutationError = (
  type: CreateEdgeMutationErrorType,
  details: string | null = null,
): CreateEdgeMutationError => ({
  __typename: 'CreateEdgeMutationError',
  type,
  details,
})
