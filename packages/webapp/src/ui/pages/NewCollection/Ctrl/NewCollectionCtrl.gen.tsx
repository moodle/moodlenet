import * as Types from '../../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CreateCollectionMutationVariables = Types.Exact<{
  res: Types.CreateNodeInput;
}>;


export type CreateCollectionMutation = (
  { __typename: 'Mutation' }
  & { collection: (
    { __typename: 'CreateNodeMutationSuccess' }
    & { node: (
      { __typename: 'Collection' }
      & Pick<Types.Collection, 'id' | 'name' | 'description' | 'image'>
    ) | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
  ) | (
    { __typename: 'CreateNodeMutationError' }
    & Pick<Types.CreateNodeMutationError, 'type' | 'details'>
  ) }
);

export type CreateCollectionRelationMutationVariables = Types.Exact<{
  edge: Types.CreateEdgeInput;
}>;


export type CreateCollectionRelationMutation = (
  { __typename: 'Mutation' }
  & { createEdge: { __typename: 'CreateEdgeMutationSuccess' } | (
    { __typename: 'CreateEdgeMutationError' }
    & Pick<Types.CreateEdgeMutationError, 'type' | 'details'>
  ) }
);


export const CreateCollectionDocument = gql`
    mutation createCollection($res: CreateNodeInput!) {
  collection: createNode(input: $res) {
    __typename
    ... on CreateNodeMutationError {
      type
      details
    }
    ... on CreateNodeMutationSuccess {
      node {
        __typename
        ... on Collection {
          id
          name
          description
          image
        }
      }
    }
  }
}
    `;
export type CreateCollectionMutationFn = Apollo.MutationFunction<CreateCollectionMutation, CreateCollectionMutationVariables>;

/**
 * __useCreateCollectionMutation__
 *
 * To run a mutation, you first call `useCreateCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCollectionMutation, { data, loading, error }] = useCreateCollectionMutation({
 *   variables: {
 *      res: // value for 'res'
 *   },
 * });
 */
export function useCreateCollectionMutation(baseOptions?: Apollo.MutationHookOptions<CreateCollectionMutation, CreateCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCollectionMutation, CreateCollectionMutationVariables>(CreateCollectionDocument, options);
      }
export type CreateCollectionMutationHookResult = ReturnType<typeof useCreateCollectionMutation>;
export type CreateCollectionMutationResult = Apollo.MutationResult<CreateCollectionMutation>;
export type CreateCollectionMutationOptions = Apollo.BaseMutationOptions<CreateCollectionMutation, CreateCollectionMutationVariables>;
export const CreateCollectionRelationDocument = gql`
    mutation createCollectionRelation($edge: CreateEdgeInput!) {
  createEdge(input: $edge) {
    __typename
    ... on CreateEdgeMutationError {
      type
      details
    }
  }
}
    `;
export type CreateCollectionRelationMutationFn = Apollo.MutationFunction<CreateCollectionRelationMutation, CreateCollectionRelationMutationVariables>;

/**
 * __useCreateCollectionRelationMutation__
 *
 * To run a mutation, you first call `useCreateCollectionRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCollectionRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCollectionRelationMutation, { data, loading, error }] = useCreateCollectionRelationMutation({
 *   variables: {
 *      edge: // value for 'edge'
 *   },
 * });
 */
export function useCreateCollectionRelationMutation(baseOptions?: Apollo.MutationHookOptions<CreateCollectionRelationMutation, CreateCollectionRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCollectionRelationMutation, CreateCollectionRelationMutationVariables>(CreateCollectionRelationDocument, options);
      }
export type CreateCollectionRelationMutationHookResult = ReturnType<typeof useCreateCollectionRelationMutation>;
export type CreateCollectionRelationMutationResult = Apollo.MutationResult<CreateCollectionRelationMutation>;
export type CreateCollectionRelationMutationOptions = Apollo.BaseMutationOptions<CreateCollectionRelationMutation, CreateCollectionRelationMutationVariables>;