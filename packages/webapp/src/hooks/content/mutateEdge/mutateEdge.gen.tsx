import * as Types from '../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CreateEdgeMutationVariables = Types.Exact<{
  input: Types.CreateEdgeInput;
}>;


export type CreateEdgeMutation = (
  { __typename: 'Mutation' }
  & { createEdge: (
    { __typename: 'CreateEdgeMutationSuccess' }
    & BasicCreateEdgeMutationPayload_CreateEdgeMutationSuccess_Fragment
  ) | (
    { __typename: 'CreateEdgeMutationError' }
    & BasicCreateEdgeMutationPayload_CreateEdgeMutationError_Fragment
  ) }
);

export type DeleteEdgeMutationVariables = Types.Exact<{
  input: Types.DeleteEdgeInput;
}>;


export type DeleteEdgeMutation = (
  { __typename: 'Mutation' }
  & { deleteEdge: (
    { __typename: 'DeleteEdgeMutationSuccess' }
    & BasicDeleteEdgeMutationPayload_DeleteEdgeMutationSuccess_Fragment
  ) | (
    { __typename: 'DeleteEdgeMutationError' }
    & BasicDeleteEdgeMutationPayload_DeleteEdgeMutationError_Fragment
  ) }
);

export type BasicCreateEdgeMutationPayload_CreateEdgeMutationSuccess_Fragment = (
  { __typename: 'CreateEdgeMutationSuccess' }
  & { edge: (
    { __typename: 'AppliesTo' }
    & Pick<Types.AppliesTo, 'id'>
  ) | (
    { __typename: 'Contains' }
    & Pick<Types.Contains, 'id'>
  ) | (
    { __typename: 'Created' }
    & Pick<Types.Created, 'id'>
  ) | (
    { __typename: 'Edited' }
    & Pick<Types.Edited, 'id'>
  ) | (
    { __typename: 'Follows' }
    & Pick<Types.Follows, 'id'>
  ) | (
    { __typename: 'Likes' }
    & Pick<Types.Likes, 'id'>
  ) }
);

export type BasicCreateEdgeMutationPayload_CreateEdgeMutationError_Fragment = (
  { __typename: 'CreateEdgeMutationError' }
  & Pick<Types.CreateEdgeMutationError, 'type' | 'details'>
);

export type BasicCreateEdgeMutationPayloadFragment = BasicCreateEdgeMutationPayload_CreateEdgeMutationSuccess_Fragment | BasicCreateEdgeMutationPayload_CreateEdgeMutationError_Fragment;

export type BasicDeleteEdgeMutationPayload_DeleteEdgeMutationSuccess_Fragment = (
  { __typename: 'DeleteEdgeMutationSuccess' }
  & Pick<Types.DeleteEdgeMutationSuccess, 'edgeId'>
);

export type BasicDeleteEdgeMutationPayload_DeleteEdgeMutationError_Fragment = (
  { __typename: 'DeleteEdgeMutationError' }
  & Pick<Types.DeleteEdgeMutationError, 'type' | 'details'>
);

export type BasicDeleteEdgeMutationPayloadFragment = BasicDeleteEdgeMutationPayload_DeleteEdgeMutationSuccess_Fragment | BasicDeleteEdgeMutationPayload_DeleteEdgeMutationError_Fragment;

export const BasicCreateEdgeMutationPayloadFragmentDoc = gql`
    fragment BasicCreateEdgeMutationPayload on CreateEdgeMutationPayload {
  ... on CreateEdgeMutationSuccess {
    edge {
      ... on IEdge {
        id
      }
    }
  }
  ... on CreateEdgeMutationError {
    type
    details
  }
}
    `;
export const BasicDeleteEdgeMutationPayloadFragmentDoc = gql`
    fragment BasicDeleteEdgeMutationPayload on DeleteEdgeMutationPayload {
  ... on DeleteEdgeMutationSuccess {
    edgeId
  }
  ... on DeleteEdgeMutationError {
    type
    details
  }
}
    `;
export const CreateEdgeDocument = gql`
    mutation CreateEdge($input: CreateEdgeInput!) {
  createEdge(input: $input) {
    ...BasicCreateEdgeMutationPayload
  }
}
    ${BasicCreateEdgeMutationPayloadFragmentDoc}`;
export type CreateEdgeMutationFn = Apollo.MutationFunction<CreateEdgeMutation, CreateEdgeMutationVariables>;

/**
 * __useCreateEdgeMutation__
 *
 * To run a mutation, you first call `useCreateEdgeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEdgeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEdgeMutation, { data, loading, error }] = useCreateEdgeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateEdgeMutation(baseOptions?: Apollo.MutationHookOptions<CreateEdgeMutation, CreateEdgeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEdgeMutation, CreateEdgeMutationVariables>(CreateEdgeDocument, options);
      }
export type CreateEdgeMutationHookResult = ReturnType<typeof useCreateEdgeMutation>;
export type CreateEdgeMutationResult = Apollo.MutationResult<CreateEdgeMutation>;
export type CreateEdgeMutationOptions = Apollo.BaseMutationOptions<CreateEdgeMutation, CreateEdgeMutationVariables>;
export const DeleteEdgeDocument = gql`
    mutation DeleteEdge($input: DeleteEdgeInput!) {
  deleteEdge(input: $input) {
    ...BasicDeleteEdgeMutationPayload
  }
}
    ${BasicDeleteEdgeMutationPayloadFragmentDoc}`;
export type DeleteEdgeMutationFn = Apollo.MutationFunction<DeleteEdgeMutation, DeleteEdgeMutationVariables>;

/**
 * __useDeleteEdgeMutation__
 *
 * To run a mutation, you first call `useDeleteEdgeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEdgeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEdgeMutation, { data, loading, error }] = useDeleteEdgeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteEdgeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEdgeMutation, DeleteEdgeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEdgeMutation, DeleteEdgeMutationVariables>(DeleteEdgeDocument, options);
      }
export type DeleteEdgeMutationHookResult = ReturnType<typeof useDeleteEdgeMutation>;
export type DeleteEdgeMutationResult = Apollo.MutationResult<DeleteEdgeMutation>;
export type DeleteEdgeMutationOptions = Apollo.BaseMutationOptions<DeleteEdgeMutation, DeleteEdgeMutationVariables>;