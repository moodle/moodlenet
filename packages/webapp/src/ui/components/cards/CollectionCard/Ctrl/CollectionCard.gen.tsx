import * as Types from '../../../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CollectionCardQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  myProfileId?: Types.Maybe<Array<Types.Scalars['ID']> | Types.Scalars['ID']>;
}>;


export type CollectionCardQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<(
    { __typename: 'Collection' }
    & Pick<Types.Collection, 'id' | 'name' | 'image'>
    & { followersCount: Types.Collection['_relCount'] }
    & { myFollow: (
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
    ) }
  ) | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' }> }
);

export type DelCollectionCardRelationMutationVariables = Types.Exact<{
  edge: Types.DeleteEdgeInput;
}>;


export type DelCollectionCardRelationMutation = (
  { __typename: 'Mutation' }
  & { deleteEdge: { __typename: 'DeleteEdgeMutationSuccess' } | (
    { __typename: 'DeleteEdgeMutationError' }
    & Pick<Types.DeleteEdgeMutationError, 'type' | 'details'>
  ) }
);

export type AddCollectionCardRelationMutationVariables = Types.Exact<{
  edge: Types.CreateEdgeInput;
}>;


export type AddCollectionCardRelationMutation = (
  { __typename: 'Mutation' }
  & { createEdge: { __typename: 'CreateEdgeMutationSuccess' } | (
    { __typename: 'CreateEdgeMutationError' }
    & Pick<Types.CreateEdgeMutationError, 'type' | 'details'>
  ) }
);


export const CollectionCardDocument = gql`
    query CollectionCard($id: ID!, $myProfileId: [ID!]) {
  node(id: $id) {
    ... on Collection {
      id
      name
      image
      followersCount: _relCount(type: Follows, target: Profile, inverse: true)
      myFollow: _rel(
        type: Follows
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
    }
  }
}
    `;

/**
 * __useCollectionCardQuery__
 *
 * To run a query within a React component, call `useCollectionCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionCardQuery({
 *   variables: {
 *      id: // value for 'id'
 *      myProfileId: // value for 'myProfileId'
 *   },
 * });
 */
export function useCollectionCardQuery(baseOptions: Apollo.QueryHookOptions<CollectionCardQuery, CollectionCardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionCardQuery, CollectionCardQueryVariables>(CollectionCardDocument, options);
      }
export function useCollectionCardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionCardQuery, CollectionCardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionCardQuery, CollectionCardQueryVariables>(CollectionCardDocument, options);
        }
export type CollectionCardQueryHookResult = ReturnType<typeof useCollectionCardQuery>;
export type CollectionCardLazyQueryHookResult = ReturnType<typeof useCollectionCardLazyQuery>;
export type CollectionCardQueryResult = Apollo.QueryResult<CollectionCardQuery, CollectionCardQueryVariables>;
export const DelCollectionCardRelationDocument = gql`
    mutation delCollectionCardRelation($edge: DeleteEdgeInput!) {
  deleteEdge(input: $edge) {
    ... on DeleteEdgeMutationError {
      type
      details
    }
  }
}
    `;
export type DelCollectionCardRelationMutationFn = Apollo.MutationFunction<DelCollectionCardRelationMutation, DelCollectionCardRelationMutationVariables>;

/**
 * __useDelCollectionCardRelationMutation__
 *
 * To run a mutation, you first call `useDelCollectionCardRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDelCollectionCardRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [delCollectionCardRelationMutation, { data, loading, error }] = useDelCollectionCardRelationMutation({
 *   variables: {
 *      edge: // value for 'edge'
 *   },
 * });
 */
export function useDelCollectionCardRelationMutation(baseOptions?: Apollo.MutationHookOptions<DelCollectionCardRelationMutation, DelCollectionCardRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DelCollectionCardRelationMutation, DelCollectionCardRelationMutationVariables>(DelCollectionCardRelationDocument, options);
      }
export type DelCollectionCardRelationMutationHookResult = ReturnType<typeof useDelCollectionCardRelationMutation>;
export type DelCollectionCardRelationMutationResult = Apollo.MutationResult<DelCollectionCardRelationMutation>;
export type DelCollectionCardRelationMutationOptions = Apollo.BaseMutationOptions<DelCollectionCardRelationMutation, DelCollectionCardRelationMutationVariables>;
export const AddCollectionCardRelationDocument = gql`
    mutation addCollectionCardRelation($edge: CreateEdgeInput!) {
  createEdge(input: $edge) {
    ... on CreateEdgeMutationError {
      type
      details
    }
  }
}
    `;
export type AddCollectionCardRelationMutationFn = Apollo.MutationFunction<AddCollectionCardRelationMutation, AddCollectionCardRelationMutationVariables>;

/**
 * __useAddCollectionCardRelationMutation__
 *
 * To run a mutation, you first call `useAddCollectionCardRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCollectionCardRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCollectionCardRelationMutation, { data, loading, error }] = useAddCollectionCardRelationMutation({
 *   variables: {
 *      edge: // value for 'edge'
 *   },
 * });
 */
export function useAddCollectionCardRelationMutation(baseOptions?: Apollo.MutationHookOptions<AddCollectionCardRelationMutation, AddCollectionCardRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCollectionCardRelationMutation, AddCollectionCardRelationMutationVariables>(AddCollectionCardRelationDocument, options);
      }
export type AddCollectionCardRelationMutationHookResult = ReturnType<typeof useAddCollectionCardRelationMutation>;
export type AddCollectionCardRelationMutationResult = Apollo.MutationResult<AddCollectionCardRelationMutation>;
export type AddCollectionCardRelationMutationOptions = Apollo.BaseMutationOptions<AddCollectionCardRelationMutation, AddCollectionCardRelationMutationVariables>;