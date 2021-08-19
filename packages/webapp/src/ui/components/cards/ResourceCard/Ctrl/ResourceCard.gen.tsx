import * as Types from '../../../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type ResourceCardQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  myProfileId?: Types.Maybe<Array<Types.Scalars['ID']> | Types.Scalars['ID']>;
}>;


export type ResourceCardQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<{ __typename: 'Collection' } | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | (
    { __typename: 'Resource' }
    & Pick<Types.Resource, 'id' | 'name' | 'image' | 'kind' | 'content' | 'description'>
    & { likesCount: Types.Resource['_relCount'] }
    & { inCollections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name'>
        ) | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ), myBookmarked: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { edge: (
          { __typename: 'Bookmarked' }
          & Pick<Types.Bookmarked, 'id'>
        ) | (
          { __typename: 'Created' }
          & Pick<Types.Created, 'id'>
        ) | (
          { __typename: 'Features' }
          & Pick<Types.Features, 'id'>
        ) | (
          { __typename: 'Follows' }
          & Pick<Types.Follows, 'id'>
        ) | (
          { __typename: 'Likes' }
          & Pick<Types.Likes, 'id'>
        ) | (
          { __typename: 'Pinned' }
          & Pick<Types.Pinned, 'id'>
        ) }
      )> }
    ), myLike: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { edge: (
          { __typename: 'Bookmarked' }
          & Pick<Types.Bookmarked, 'id'>
        ) | (
          { __typename: 'Created' }
          & Pick<Types.Created, 'id'>
        ) | (
          { __typename: 'Features' }
          & Pick<Types.Features, 'id'>
        ) | (
          { __typename: 'Follows' }
          & Pick<Types.Follows, 'id'>
        ) | (
          { __typename: 'Likes' }
          & Pick<Types.Likes, 'id'>
        ) | (
          { __typename: 'Pinned' }
          & Pick<Types.Pinned, 'id'>
        ) }
      )> }
    ) }
  ) | { __typename: 'ResourceType' }> }
);

export type DelResourceCardRelationMutationVariables = Types.Exact<{
  edge: Types.DeleteEdgeInput;
}>;


export type DelResourceCardRelationMutation = (
  { __typename: 'Mutation' }
  & { deleteEdge: { __typename: 'DeleteEdgeMutationSuccess' } | (
    { __typename: 'DeleteEdgeMutationError' }
    & Pick<Types.DeleteEdgeMutationError, 'type' | 'details'>
  ) }
);

export type AddResourceCardRelationMutationVariables = Types.Exact<{
  edge: Types.CreateEdgeInput;
}>;


export type AddResourceCardRelationMutation = (
  { __typename: 'Mutation' }
  & { createEdge: { __typename: 'CreateEdgeMutationSuccess' } | (
    { __typename: 'CreateEdgeMutationError' }
    & Pick<Types.CreateEdgeMutationError, 'type' | 'details'>
  ) }
);


export const ResourceCardDocument = gql`
    query ResourceCard($id: ID!, $myProfileId: [ID!]) {
  node(id: $id) {
    ... on Resource {
      id
      name
      image
      kind
      content
      description
      image
      inCollections: _rel(
        type: Features
        target: Collection
        inverse: true
        page: {first: 3}
      ) {
        edges {
          node {
            ... on Collection {
              id
              name
            }
          }
        }
      }
      myBookmarked: _rel(
        type: Bookmarked
        target: Profile
        inverse: true
        page: {first: 1}
        targetIds: $myProfileId
      ) {
        edges {
          edge {
            id
          }
        }
      }
      likesCount: _relCount(type: Likes, target: Profile, inverse: true)
      myLike: _rel(
        type: Likes
        target: Profile
        inverse: true
        page: {first: 1}
        targetIds: $myProfileId
      ) {
        edges {
          edge {
            id
          }
        }
      }
    }
  }
}
    `;

/**
 * __useResourceCardQuery__
 *
 * To run a query within a React component, call `useResourceCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useResourceCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useResourceCardQuery({
 *   variables: {
 *      id: // value for 'id'
 *      myProfileId: // value for 'myProfileId'
 *   },
 * });
 */
export function useResourceCardQuery(baseOptions: Apollo.QueryHookOptions<ResourceCardQuery, ResourceCardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ResourceCardQuery, ResourceCardQueryVariables>(ResourceCardDocument, options);
      }
export function useResourceCardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ResourceCardQuery, ResourceCardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ResourceCardQuery, ResourceCardQueryVariables>(ResourceCardDocument, options);
        }
export type ResourceCardQueryHookResult = ReturnType<typeof useResourceCardQuery>;
export type ResourceCardLazyQueryHookResult = ReturnType<typeof useResourceCardLazyQuery>;
export type ResourceCardQueryResult = Apollo.QueryResult<ResourceCardQuery, ResourceCardQueryVariables>;
export const DelResourceCardRelationDocument = gql`
    mutation delResourceCardRelation($edge: DeleteEdgeInput!) {
  deleteEdge(input: $edge) {
    ... on DeleteEdgeMutationError {
      type
      details
    }
  }
}
    `;
export type DelResourceCardRelationMutationFn = Apollo.MutationFunction<DelResourceCardRelationMutation, DelResourceCardRelationMutationVariables>;

/**
 * __useDelResourceCardRelationMutation__
 *
 * To run a mutation, you first call `useDelResourceCardRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDelResourceCardRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [delResourceCardRelationMutation, { data, loading, error }] = useDelResourceCardRelationMutation({
 *   variables: {
 *      edge: // value for 'edge'
 *   },
 * });
 */
export function useDelResourceCardRelationMutation(baseOptions?: Apollo.MutationHookOptions<DelResourceCardRelationMutation, DelResourceCardRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DelResourceCardRelationMutation, DelResourceCardRelationMutationVariables>(DelResourceCardRelationDocument, options);
      }
export type DelResourceCardRelationMutationHookResult = ReturnType<typeof useDelResourceCardRelationMutation>;
export type DelResourceCardRelationMutationResult = Apollo.MutationResult<DelResourceCardRelationMutation>;
export type DelResourceCardRelationMutationOptions = Apollo.BaseMutationOptions<DelResourceCardRelationMutation, DelResourceCardRelationMutationVariables>;
export const AddResourceCardRelationDocument = gql`
    mutation addResourceCardRelation($edge: CreateEdgeInput!) {
  createEdge(input: $edge) {
    ... on CreateEdgeMutationError {
      type
      details
    }
  }
}
    `;
export type AddResourceCardRelationMutationFn = Apollo.MutationFunction<AddResourceCardRelationMutation, AddResourceCardRelationMutationVariables>;

/**
 * __useAddResourceCardRelationMutation__
 *
 * To run a mutation, you first call `useAddResourceCardRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddResourceCardRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addResourceCardRelationMutation, { data, loading, error }] = useAddResourceCardRelationMutation({
 *   variables: {
 *      edge: // value for 'edge'
 *   },
 * });
 */
export function useAddResourceCardRelationMutation(baseOptions?: Apollo.MutationHookOptions<AddResourceCardRelationMutation, AddResourceCardRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddResourceCardRelationMutation, AddResourceCardRelationMutationVariables>(AddResourceCardRelationDocument, options);
      }
export type AddResourceCardRelationMutationHookResult = ReturnType<typeof useAddResourceCardRelationMutation>;
export type AddResourceCardRelationMutationResult = Apollo.MutationResult<AddResourceCardRelationMutation>;
export type AddResourceCardRelationMutationOptions = Apollo.BaseMutationOptions<AddResourceCardRelationMutation, AddResourceCardRelationMutationVariables>;