import {
  CreateEdgeMutationError,
  CreateEdgeMutationErrorType,
  CreateNodeMutationError,
  CreateNodeMutationErrorType,
  Edge,
  Node,
} from '../ContentGraph.graphql.gen'

export const fakeUnshallowNodeForResolverReturnType = <N extends Node>(
  shallow: Pick<N, '_id'> & Partial<Omit<N, '_id'>>
): N => shallow as N
export const fakeUnshallowEdgeForResolverReturnType = <E extends Edge>(
  shallow: Pick<E, '_id'>
): E => shallow as E

export function unreachable(shouldBeNever: never): never {
  throw new Error(
    `Didn't expect to get here assertUnreachable ${shouldBeNever}`
  )
}

export const createNodeMutationError = (
  type: CreateNodeMutationErrorType,
  details: string | null = null
): CreateNodeMutationError => ({
  __typename: 'CreateNodeMutationError',
  type,
  details,
})

export const createEdgeMutationError = (
  type: CreateEdgeMutationErrorType,
  details: string | null = null
): CreateEdgeMutationError => ({
  __typename: 'CreateEdgeMutationError',
  type,
  details,
})
