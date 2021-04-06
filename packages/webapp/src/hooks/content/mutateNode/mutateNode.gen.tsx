import * as Types from '../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type CreateNodeMutationVariables = Types.Exact<{
  input: Types.CreateNodeInput;
}>;


export type CreateNodeMutation = (
  { __typename: 'Mutation' }
  & { createNode: (
    { __typename: 'CreateNodeMutationSuccess' }
    & BasicCreateNodeMutationPayload_CreateNodeMutationSuccess_Fragment
  ) | (
    { __typename: 'CreateNodeMutationError' }
    & BasicCreateNodeMutationPayload_CreateNodeMutationError_Fragment
  ) }
);

export type DeleteNodeMutationVariables = Types.Exact<{
  input: Types.DeleteNodeInput;
}>;


export type DeleteNodeMutation = (
  { __typename: 'Mutation' }
  & { deleteNode: (
    { __typename: 'DeleteNodeMutationSuccess' }
    & BasicDeleteNodeMutationPayload_DeleteNodeMutationSuccess_Fragment
  ) | (
    { __typename: 'DeleteNodeMutationError' }
    & BasicDeleteNodeMutationPayload_DeleteNodeMutationError_Fragment
  ) }
);

export type BasicCreateNodeMutationPayload_CreateNodeMutationSuccess_Fragment = (
  { __typename: 'CreateNodeMutationSuccess' }
  & { node: (
    { __typename: 'Collection' }
    & Pick<Types.Collection, '_id'>
  ) | (
    { __typename: 'Profile' }
    & Pick<Types.Profile, '_id'>
  ) | (
    { __typename: 'Resource' }
    & Pick<Types.Resource, '_id'>
  ) | (
    { __typename: 'Subject' }
    & Pick<Types.Subject, '_id'>
  ) }
);

export type BasicCreateNodeMutationPayload_CreateNodeMutationError_Fragment = (
  { __typename: 'CreateNodeMutationError' }
  & Pick<Types.CreateNodeMutationError, 'type' | 'details'>
);

export type BasicCreateNodeMutationPayloadFragment = BasicCreateNodeMutationPayload_CreateNodeMutationSuccess_Fragment | BasicCreateNodeMutationPayload_CreateNodeMutationError_Fragment;

export type BasicDeleteNodeMutationPayload_DeleteNodeMutationSuccess_Fragment = (
  { __typename: 'DeleteNodeMutationSuccess' }
  & Pick<Types.DeleteNodeMutationSuccess, 'nodeId'>
);

export type BasicDeleteNodeMutationPayload_DeleteNodeMutationError_Fragment = (
  { __typename: 'DeleteNodeMutationError' }
  & Pick<Types.DeleteNodeMutationError, 'type' | 'details'>
);

export type BasicDeleteNodeMutationPayloadFragment = BasicDeleteNodeMutationPayload_DeleteNodeMutationSuccess_Fragment | BasicDeleteNodeMutationPayload_DeleteNodeMutationError_Fragment;

export const BasicCreateNodeMutationPayloadFragmentDoc = gql`
    fragment BasicCreateNodeMutationPayload on CreateNodeMutationPayload {
  ... on CreateNodeMutationSuccess {
    node {
      ... on INode {
        _id
      }
    }
  }
  ... on CreateNodeMutationError {
    type
    details
  }
}
    `;
export const BasicDeleteNodeMutationPayloadFragmentDoc = gql`
    fragment BasicDeleteNodeMutationPayload on DeleteNodeMutationPayload {
  ... on DeleteNodeMutationSuccess {
    nodeId
  }
  ... on DeleteNodeMutationError {
    type
    details
  }
}
    `;
export const CreateNodeDocument = gql`
    mutation CreateNode($input: CreateNodeInput!) {
  createNode(input: $input) {
    ...BasicCreateNodeMutationPayload
  }
}
    ${BasicCreateNodeMutationPayloadFragmentDoc}`;
export type CreateNodeMutationFn = Apollo.MutationFunction<CreateNodeMutation, CreateNodeMutationVariables>;

/**
 * __useCreateNodeMutation__
 *
 * To run a mutation, you first call `useCreateNodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNodeMutation, { data, loading, error }] = useCreateNodeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateNodeMutation(baseOptions?: Apollo.MutationHookOptions<CreateNodeMutation, CreateNodeMutationVariables>) {
        return Apollo.useMutation<CreateNodeMutation, CreateNodeMutationVariables>(CreateNodeDocument, baseOptions);
      }
export type CreateNodeMutationHookResult = ReturnType<typeof useCreateNodeMutation>;
export type CreateNodeMutationResult = Apollo.MutationResult<CreateNodeMutation>;
export type CreateNodeMutationOptions = Apollo.BaseMutationOptions<CreateNodeMutation, CreateNodeMutationVariables>;
export const DeleteNodeDocument = gql`
    mutation DeleteNode($input: DeleteNodeInput!) {
  deleteNode(input: $input) {
    ...BasicDeleteNodeMutationPayload
  }
}
    ${BasicDeleteNodeMutationPayloadFragmentDoc}`;
export type DeleteNodeMutationFn = Apollo.MutationFunction<DeleteNodeMutation, DeleteNodeMutationVariables>;

/**
 * __useDeleteNodeMutation__
 *
 * To run a mutation, you first call `useDeleteNodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteNodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteNodeMutation, { data, loading, error }] = useDeleteNodeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteNodeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteNodeMutation, DeleteNodeMutationVariables>) {
        return Apollo.useMutation<DeleteNodeMutation, DeleteNodeMutationVariables>(DeleteNodeDocument, baseOptions);
      }
export type DeleteNodeMutationHookResult = ReturnType<typeof useDeleteNodeMutation>;
export type DeleteNodeMutationResult = Apollo.MutationResult<DeleteNodeMutation>;
export type DeleteNodeMutationOptions = Apollo.BaseMutationOptions<DeleteNodeMutation, DeleteNodeMutationVariables>;