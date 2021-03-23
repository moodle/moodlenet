import * as Types from '../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type CollectionPageNodeQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type CollectionPageNodeQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<(
    { __typename: 'Collection' }
    & Pick<Types.Collection, '_id' | 'name' | 'icon'>
    & { myFollow: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { edge: (
          { __typename: 'AppliesTo' }
          & Pick<Types.AppliesTo, '_id'>
        ) | (
          { __typename: 'Contains' }
          & Pick<Types.Contains, '_id'>
        ) | (
          { __typename: 'Created' }
          & Pick<Types.Created, '_id'>
        ) | (
          { __typename: 'Follows' }
          & Pick<Types.Follows, '_id'>
        ) | (
          { __typename: 'Likes' }
          & Pick<Types.Likes, '_id'>
        ) }
      )> }
    ), _meta: (
      { __typename: 'NodeMeta' }
      & Pick<Types.NodeMeta, 'created'>
      & { creator: (
        { __typename: 'Profile' }
        & Pick<Types.Profile, '_id' | 'name' | 'icon'>
      ), relCount?: Types.Maybe<(
        { __typename: 'RelCountMap' }
        & { Follows?: Types.Maybe<(
          { __typename: 'RelCount' }
          & { from?: Types.Maybe<(
            { __typename: 'RelCountTargetMap' }
            & Pick<Types.RelCountTargetMap, 'Profile'>
          )> }
        )>, Contains?: Types.Maybe<(
          { __typename: 'RelCount' }
          & { to?: Types.Maybe<(
            { __typename: 'RelCountTargetMap' }
            & Pick<Types.RelCountTargetMap, 'Resource'>
          )> }
        )> }
      )> }
    ) }
  ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'Subject' }> }
);

export type CollectionPageResourcesQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type CollectionPageResourcesQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<(
    { __typename: 'Collection' }
    & Pick<Types.Collection, '_id'>
    & { resourceList: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'Profile' } | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, '_id' | 'name' | 'icon'>
          & { collections: (
            { __typename: 'RelPage' }
            & { edges: Array<(
              { __typename: 'RelPageEdge' }
              & { node: (
                { __typename: 'Collection' }
                & Pick<Types.Collection, '_id' | 'name'>
              ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'Subject' } }
            )> }
          ) }
        ) | { __typename: 'Subject' } }
      )> }
    ) }
  ) | (
    { __typename: 'Profile' }
    & Pick<Types.Profile, '_id'>
    & { resourceList: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'Profile' } | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, '_id' | 'name' | 'icon'>
          & { collections: (
            { __typename: 'RelPage' }
            & { edges: Array<(
              { __typename: 'RelPageEdge' }
              & { node: (
                { __typename: 'Collection' }
                & Pick<Types.Collection, '_id' | 'name'>
              ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'Subject' } }
            )> }
          ) }
        ) | { __typename: 'Subject' } }
      )> }
    ) }
  ) | (
    { __typename: 'Resource' }
    & Pick<Types.Resource, '_id'>
    & { resourceList: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'Profile' } | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, '_id' | 'name' | 'icon'>
          & { collections: (
            { __typename: 'RelPage' }
            & { edges: Array<(
              { __typename: 'RelPageEdge' }
              & { node: (
                { __typename: 'Collection' }
                & Pick<Types.Collection, '_id' | 'name'>
              ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'Subject' } }
            )> }
          ) }
        ) | { __typename: 'Subject' } }
      )> }
    ) }
  ) | (
    { __typename: 'Subject' }
    & Pick<Types.Subject, '_id'>
    & { resourceList: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'Profile' } | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, '_id' | 'name' | 'icon'>
          & { collections: (
            { __typename: 'RelPage' }
            & { edges: Array<(
              { __typename: 'RelPageEdge' }
              & { node: (
                { __typename: 'Collection' }
                & Pick<Types.Collection, '_id' | 'name'>
              ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'Subject' } }
            )> }
          ) }
        ) | { __typename: 'Subject' } }
      )> }
    ) }
  )> }
);

export type CollectionPageFollowMutationVariables = Types.Exact<{
  currentProfileId: Types.Scalars['ID'];
  collectionId: Types.Scalars['ID'];
}>;


export type CollectionPageFollowMutation = (
  { __typename: 'Mutation' }
  & { createEdge: (
    { __typename: 'CreateEdgeMutationSuccess' }
    & BasicCreateEdgeMutationPayload_CreateEdgeMutationSuccess_Fragment
  ) | (
    { __typename: 'CreateEdgeMutationError' }
    & BasicCreateEdgeMutationPayload_CreateEdgeMutationError_Fragment
  ) }
);

export type BasicCreateEdgeMutationPayload_CreateEdgeMutationSuccess_Fragment = (
  { __typename: 'CreateEdgeMutationSuccess' }
  & { edge?: Types.Maybe<(
    { __typename: 'AppliesTo' }
    & Pick<Types.AppliesTo, '_id'>
  ) | (
    { __typename: 'Contains' }
    & Pick<Types.Contains, '_id'>
  ) | (
    { __typename: 'Created' }
    & Pick<Types.Created, '_id'>
  ) | (
    { __typename: 'Follows' }
    & Pick<Types.Follows, '_id'>
  ) | (
    { __typename: 'Likes' }
    & Pick<Types.Likes, '_id'>
  )> }
);

export type BasicCreateEdgeMutationPayload_CreateEdgeMutationError_Fragment = (
  { __typename: 'CreateEdgeMutationError' }
  & Pick<Types.CreateEdgeMutationError, 'type' | 'details'>
);

export type BasicCreateEdgeMutationPayloadFragment = BasicCreateEdgeMutationPayload_CreateEdgeMutationSuccess_Fragment | BasicCreateEdgeMutationPayload_CreateEdgeMutationError_Fragment;

export type CollectionPageUnfollowMutationVariables = Types.Exact<{
  edgeId: Types.Scalars['ID'];
}>;


export type CollectionPageUnfollowMutation = (
  { __typename: 'Mutation' }
  & { deleteEdge: (
    { __typename: 'DeleteEdgeMutationSuccess' }
    & BasicDeleteEdgeMutationPayload_DeleteEdgeMutationSuccess_Fragment
  ) | (
    { __typename: 'DeleteEdgeMutationError' }
    & BasicDeleteEdgeMutationPayload_DeleteEdgeMutationError_Fragment
  ) }
);

export type BasicDeleteEdgeMutationPayload_DeleteEdgeMutationSuccess_Fragment = (
  { __typename: 'DeleteEdgeMutationSuccess' }
  & { edge?: Types.Maybe<(
    { __typename: 'AppliesTo' }
    & Pick<Types.AppliesTo, '_id'>
  ) | (
    { __typename: 'Contains' }
    & Pick<Types.Contains, '_id'>
  ) | (
    { __typename: 'Created' }
    & Pick<Types.Created, '_id'>
  ) | (
    { __typename: 'Follows' }
    & Pick<Types.Follows, '_id'>
  ) | (
    { __typename: 'Likes' }
    & Pick<Types.Likes, '_id'>
  )> }
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
        _id
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
    edge {
      ... on IEdge {
        _id
      }
    }
  }
  ... on DeleteEdgeMutationError {
    type
    details
  }
}
    `;
export const CollectionPageNodeDocument = gql`
    query CollectionPageNode($id: ID!) {
  node(_id: $id) {
    ... on Collection {
      _id
      name
      icon
      myFollow: _rel(
        edge: {type: Follows, node: Profile, inverse: true, targetMe: true}
        page: {first: 1}
      ) {
        edges {
          edge {
            ... on IEdge {
              _id
            }
          }
        }
      }
      _meta {
        created
        creator {
          _id
          name
          icon
        }
        relCount {
          Follows {
            from {
              Profile
            }
          }
          Contains {
            to {
              Resource
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useCollectionPageNodeQuery__
 *
 * To run a query within a React component, call `useCollectionPageNodeQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionPageNodeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionPageNodeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCollectionPageNodeQuery(baseOptions: Apollo.QueryHookOptions<CollectionPageNodeQuery, CollectionPageNodeQueryVariables>) {
        return Apollo.useQuery<CollectionPageNodeQuery, CollectionPageNodeQueryVariables>(CollectionPageNodeDocument, baseOptions);
      }
export function useCollectionPageNodeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionPageNodeQuery, CollectionPageNodeQueryVariables>) {
          return Apollo.useLazyQuery<CollectionPageNodeQuery, CollectionPageNodeQueryVariables>(CollectionPageNodeDocument, baseOptions);
        }
export type CollectionPageNodeQueryHookResult = ReturnType<typeof useCollectionPageNodeQuery>;
export type CollectionPageNodeLazyQueryHookResult = ReturnType<typeof useCollectionPageNodeLazyQuery>;
export type CollectionPageNodeQueryResult = Apollo.QueryResult<CollectionPageNodeQuery, CollectionPageNodeQueryVariables>;
export const CollectionPageResourcesDocument = gql`
    query CollectionPageResources($id: ID!) {
  node(_id: $id) {
    ... on INode {
      _id
      resourceList: _rel(edge: {type: Contains, node: Resource}, page: {first: 10}) {
        edges {
          node {
            ... on Resource {
              _id
              name
              icon
              collections: _rel(
                edge: {type: Contains, node: Collection, inverse: true}
                page: {first: 2}
              ) {
                edges {
                  node {
                    ... on Collection {
                      _id
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useCollectionPageResourcesQuery__
 *
 * To run a query within a React component, call `useCollectionPageResourcesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionPageResourcesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionPageResourcesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCollectionPageResourcesQuery(baseOptions: Apollo.QueryHookOptions<CollectionPageResourcesQuery, CollectionPageResourcesQueryVariables>) {
        return Apollo.useQuery<CollectionPageResourcesQuery, CollectionPageResourcesQueryVariables>(CollectionPageResourcesDocument, baseOptions);
      }
export function useCollectionPageResourcesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionPageResourcesQuery, CollectionPageResourcesQueryVariables>) {
          return Apollo.useLazyQuery<CollectionPageResourcesQuery, CollectionPageResourcesQueryVariables>(CollectionPageResourcesDocument, baseOptions);
        }
export type CollectionPageResourcesQueryHookResult = ReturnType<typeof useCollectionPageResourcesQuery>;
export type CollectionPageResourcesLazyQueryHookResult = ReturnType<typeof useCollectionPageResourcesLazyQuery>;
export type CollectionPageResourcesQueryResult = Apollo.QueryResult<CollectionPageResourcesQuery, CollectionPageResourcesQueryVariables>;
export const CollectionPageFollowDocument = gql`
    mutation CollectionPageFollow($currentProfileId: ID!, $collectionId: ID!) {
  createEdge(
    input: {edgeType: Follows, from: $currentProfileId, to: $collectionId, Follows: {}}
  ) {
    ...BasicCreateEdgeMutationPayload
  }
}
    ${BasicCreateEdgeMutationPayloadFragmentDoc}`;
export type CollectionPageFollowMutationFn = Apollo.MutationFunction<CollectionPageFollowMutation, CollectionPageFollowMutationVariables>;

/**
 * __useCollectionPageFollowMutation__
 *
 * To run a mutation, you first call `useCollectionPageFollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCollectionPageFollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [collectionPageFollowMutation, { data, loading, error }] = useCollectionPageFollowMutation({
 *   variables: {
 *      currentProfileId: // value for 'currentProfileId'
 *      collectionId: // value for 'collectionId'
 *   },
 * });
 */
export function useCollectionPageFollowMutation(baseOptions?: Apollo.MutationHookOptions<CollectionPageFollowMutation, CollectionPageFollowMutationVariables>) {
        return Apollo.useMutation<CollectionPageFollowMutation, CollectionPageFollowMutationVariables>(CollectionPageFollowDocument, baseOptions);
      }
export type CollectionPageFollowMutationHookResult = ReturnType<typeof useCollectionPageFollowMutation>;
export type CollectionPageFollowMutationResult = Apollo.MutationResult<CollectionPageFollowMutation>;
export type CollectionPageFollowMutationOptions = Apollo.BaseMutationOptions<CollectionPageFollowMutation, CollectionPageFollowMutationVariables>;
export const CollectionPageUnfollowDocument = gql`
    mutation CollectionPageUnfollow($edgeId: ID!) {
  deleteEdge(input: {_id: $edgeId, edgeType: Follows}) {
    ...BasicDeleteEdgeMutationPayload
  }
}
    ${BasicDeleteEdgeMutationPayloadFragmentDoc}`;
export type CollectionPageUnfollowMutationFn = Apollo.MutationFunction<CollectionPageUnfollowMutation, CollectionPageUnfollowMutationVariables>;

/**
 * __useCollectionPageUnfollowMutation__
 *
 * To run a mutation, you first call `useCollectionPageUnfollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCollectionPageUnfollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [collectionPageUnfollowMutation, { data, loading, error }] = useCollectionPageUnfollowMutation({
 *   variables: {
 *      edgeId: // value for 'edgeId'
 *   },
 * });
 */
export function useCollectionPageUnfollowMutation(baseOptions?: Apollo.MutationHookOptions<CollectionPageUnfollowMutation, CollectionPageUnfollowMutationVariables>) {
        return Apollo.useMutation<CollectionPageUnfollowMutation, CollectionPageUnfollowMutationVariables>(CollectionPageUnfollowDocument, baseOptions);
      }
export type CollectionPageUnfollowMutationHookResult = ReturnType<typeof useCollectionPageUnfollowMutation>;
export type CollectionPageUnfollowMutationResult = Apollo.MutationResult<CollectionPageUnfollowMutation>;
export type CollectionPageUnfollowMutationOptions = Apollo.BaseMutationOptions<CollectionPageUnfollowMutation, CollectionPageUnfollowMutationVariables>;