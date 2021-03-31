import * as Types from '../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type ProfilePageNodeQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  followable: Types.Scalars['Boolean'];
}>;


export type ProfilePageNodeQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<{ __typename: 'Collection' } | (
    { __typename: 'Profile' }
    & Pick<Types.Profile, '_id' | 'name' | 'icon' | 'summary'>
    & { myFollow: Types.Maybe<(
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
    )>, _meta: (
      { __typename: 'NodeMeta' }
      & Pick<Types.NodeMeta, 'created'>
      & { relCount?: Types.Maybe<(
        { __typename: 'RelCountMap' }
        & { Follows?: Types.Maybe<(
          { __typename: 'RelCount' }
          & { from?: Types.Maybe<(
            { __typename: 'RelCountTargetMap' }
            & Pick<Types.RelCountTargetMap, 'Profile'>
          )> }
        )>, Created?: Types.Maybe<(
          { __typename: 'RelCount' }
          & { to?: Types.Maybe<(
            { __typename: 'RelCountTargetMap' }
            & Pick<Types.RelCountTargetMap, 'Resource' | 'Collection'>
          )> }
        )> }
      )> }
    ) }
  ) | { __typename: 'Resource' } | { __typename: 'Subject' }> }
);

export type ProfilePageOwnCollectionsQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type ProfilePageOwnCollectionsQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<(
    { __typename: 'Collection' }
    & Pick<Types.Collection, '_id'>
    & { ownCollections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, '_id' | 'name' | 'icon'>
          & { _meta: (
            { __typename: 'NodeMeta' }
            & { relCount?: Types.Maybe<(
              { __typename: 'RelCountMap' }
              & { Contains?: Types.Maybe<(
                { __typename: 'RelCount' }
                & { to?: Types.Maybe<(
                  { __typename: 'RelCountTargetMap' }
                  & Pick<Types.RelCountTargetMap, 'Resource'>
                )> }
              )>, Follows?: Types.Maybe<(
                { __typename: 'RelCount' }
                & { from?: Types.Maybe<(
                  { __typename: 'RelCountTargetMap' }
                  & Pick<Types.RelCountTargetMap, 'Profile'>
                )> }
              )> }
            )> }
          ) }
        ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'Subject' } }
      )> }
    ) }
  ) | (
    { __typename: 'Profile' }
    & Pick<Types.Profile, '_id'>
    & { ownCollections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, '_id' | 'name' | 'icon'>
          & { _meta: (
            { __typename: 'NodeMeta' }
            & { relCount?: Types.Maybe<(
              { __typename: 'RelCountMap' }
              & { Contains?: Types.Maybe<(
                { __typename: 'RelCount' }
                & { to?: Types.Maybe<(
                  { __typename: 'RelCountTargetMap' }
                  & Pick<Types.RelCountTargetMap, 'Resource'>
                )> }
              )>, Follows?: Types.Maybe<(
                { __typename: 'RelCount' }
                & { from?: Types.Maybe<(
                  { __typename: 'RelCountTargetMap' }
                  & Pick<Types.RelCountTargetMap, 'Profile'>
                )> }
              )> }
            )> }
          ) }
        ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'Subject' } }
      )> }
    ) }
  ) | (
    { __typename: 'Resource' }
    & Pick<Types.Resource, '_id'>
    & { ownCollections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, '_id' | 'name' | 'icon'>
          & { _meta: (
            { __typename: 'NodeMeta' }
            & { relCount?: Types.Maybe<(
              { __typename: 'RelCountMap' }
              & { Contains?: Types.Maybe<(
                { __typename: 'RelCount' }
                & { to?: Types.Maybe<(
                  { __typename: 'RelCountTargetMap' }
                  & Pick<Types.RelCountTargetMap, 'Resource'>
                )> }
              )>, Follows?: Types.Maybe<(
                { __typename: 'RelCount' }
                & { from?: Types.Maybe<(
                  { __typename: 'RelCountTargetMap' }
                  & Pick<Types.RelCountTargetMap, 'Profile'>
                )> }
              )> }
            )> }
          ) }
        ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'Subject' } }
      )> }
    ) }
  ) | (
    { __typename: 'Subject' }
    & Pick<Types.Subject, '_id'>
    & { ownCollections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, '_id' | 'name' | 'icon'>
          & { _meta: (
            { __typename: 'NodeMeta' }
            & { relCount?: Types.Maybe<(
              { __typename: 'RelCountMap' }
              & { Contains?: Types.Maybe<(
                { __typename: 'RelCount' }
                & { to?: Types.Maybe<(
                  { __typename: 'RelCountTargetMap' }
                  & Pick<Types.RelCountTargetMap, 'Resource'>
                )> }
              )>, Follows?: Types.Maybe<(
                { __typename: 'RelCount' }
                & { from?: Types.Maybe<(
                  { __typename: 'RelCountTargetMap' }
                  & Pick<Types.RelCountTargetMap, 'Profile'>
                )> }
              )> }
            )> }
          ) }
        ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'Subject' } }
      )> }
    ) }
  )> }
);

export type ProfilePageOwnResourcesQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type ProfilePageOwnResourcesQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<(
    { __typename: 'Collection' }
    & Pick<Types.Collection, '_id'>
    & { ownResources: (
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
    & { ownResources: (
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
    & { ownResources: (
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
    & { ownResources: (
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

export type ProfilePageFollowMutationVariables = Types.Exact<{
  currentProfileId: Types.Scalars['ID'];
  profileId: Types.Scalars['ID'];
}>;


export type ProfilePageFollowMutation = (
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

export type ProfilePageUnfollowMutationVariables = Types.Exact<{
  edgeId: Types.Scalars['ID'];
}>;


export type ProfilePageUnfollowMutation = (
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
    edgeId
  }
  ... on DeleteEdgeMutationError {
    type
    details
  }
}
    `;
export const ProfilePageNodeDocument = gql`
    query ProfilePageNode($id: ID!, $followable: Boolean!) {
  node(_id: $id) {
    ... on Profile {
      _id
      name
      icon
      summary
      myFollow: _rel(
        edge: {type: Follows, node: Profile, inverse: true, targetMe: true}
        page: {first: 1}
      ) @include(if: $followable) {
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
        relCount {
          Follows {
            from {
              Profile
            }
          }
          Created {
            to {
              Resource
              Collection
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useProfilePageNodeQuery__
 *
 * To run a query within a React component, call `useProfilePageNodeQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfilePageNodeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfilePageNodeQuery({
 *   variables: {
 *      id: // value for 'id'
 *      followable: // value for 'followable'
 *   },
 * });
 */
export function useProfilePageNodeQuery(baseOptions: Apollo.QueryHookOptions<ProfilePageNodeQuery, ProfilePageNodeQueryVariables>) {
        return Apollo.useQuery<ProfilePageNodeQuery, ProfilePageNodeQueryVariables>(ProfilePageNodeDocument, baseOptions);
      }
export function useProfilePageNodeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProfilePageNodeQuery, ProfilePageNodeQueryVariables>) {
          return Apollo.useLazyQuery<ProfilePageNodeQuery, ProfilePageNodeQueryVariables>(ProfilePageNodeDocument, baseOptions);
        }
export type ProfilePageNodeQueryHookResult = ReturnType<typeof useProfilePageNodeQuery>;
export type ProfilePageNodeLazyQueryHookResult = ReturnType<typeof useProfilePageNodeLazyQuery>;
export type ProfilePageNodeQueryResult = Apollo.QueryResult<ProfilePageNodeQuery, ProfilePageNodeQueryVariables>;
export const ProfilePageOwnCollectionsDocument = gql`
    query ProfilePageOwnCollections($id: ID!) {
  node(_id: $id) {
    ... on INode {
      _id
      ownCollections: _rel(edge: {type: Created, node: Collection}, page: {first: 5}) {
        edges {
          node {
            ... on Collection {
              _id
              name
              icon
              _meta {
                relCount {
                  Contains {
                    to {
                      Resource
                    }
                  }
                  Follows {
                    from {
                      Profile
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
 * __useProfilePageOwnCollectionsQuery__
 *
 * To run a query within a React component, call `useProfilePageOwnCollectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfilePageOwnCollectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfilePageOwnCollectionsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProfilePageOwnCollectionsQuery(baseOptions: Apollo.QueryHookOptions<ProfilePageOwnCollectionsQuery, ProfilePageOwnCollectionsQueryVariables>) {
        return Apollo.useQuery<ProfilePageOwnCollectionsQuery, ProfilePageOwnCollectionsQueryVariables>(ProfilePageOwnCollectionsDocument, baseOptions);
      }
export function useProfilePageOwnCollectionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProfilePageOwnCollectionsQuery, ProfilePageOwnCollectionsQueryVariables>) {
          return Apollo.useLazyQuery<ProfilePageOwnCollectionsQuery, ProfilePageOwnCollectionsQueryVariables>(ProfilePageOwnCollectionsDocument, baseOptions);
        }
export type ProfilePageOwnCollectionsQueryHookResult = ReturnType<typeof useProfilePageOwnCollectionsQuery>;
export type ProfilePageOwnCollectionsLazyQueryHookResult = ReturnType<typeof useProfilePageOwnCollectionsLazyQuery>;
export type ProfilePageOwnCollectionsQueryResult = Apollo.QueryResult<ProfilePageOwnCollectionsQuery, ProfilePageOwnCollectionsQueryVariables>;
export const ProfilePageOwnResourcesDocument = gql`
    query ProfilePageOwnResources($id: ID!) {
  node(_id: $id) {
    ... on INode {
      _id
      ownResources: _rel(edge: {type: Created, node: Resource}, page: {first: 5}) {
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
 * __useProfilePageOwnResourcesQuery__
 *
 * To run a query within a React component, call `useProfilePageOwnResourcesQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfilePageOwnResourcesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfilePageOwnResourcesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProfilePageOwnResourcesQuery(baseOptions: Apollo.QueryHookOptions<ProfilePageOwnResourcesQuery, ProfilePageOwnResourcesQueryVariables>) {
        return Apollo.useQuery<ProfilePageOwnResourcesQuery, ProfilePageOwnResourcesQueryVariables>(ProfilePageOwnResourcesDocument, baseOptions);
      }
export function useProfilePageOwnResourcesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProfilePageOwnResourcesQuery, ProfilePageOwnResourcesQueryVariables>) {
          return Apollo.useLazyQuery<ProfilePageOwnResourcesQuery, ProfilePageOwnResourcesQueryVariables>(ProfilePageOwnResourcesDocument, baseOptions);
        }
export type ProfilePageOwnResourcesQueryHookResult = ReturnType<typeof useProfilePageOwnResourcesQuery>;
export type ProfilePageOwnResourcesLazyQueryHookResult = ReturnType<typeof useProfilePageOwnResourcesLazyQuery>;
export type ProfilePageOwnResourcesQueryResult = Apollo.QueryResult<ProfilePageOwnResourcesQuery, ProfilePageOwnResourcesQueryVariables>;
export const ProfilePageFollowDocument = gql`
    mutation ProfilePageFollow($currentProfileId: ID!, $profileId: ID!) {
  createEdge(
    input: {edgeType: Follows, from: $currentProfileId, to: $profileId, Follows: {}}
  ) {
    ...BasicCreateEdgeMutationPayload
  }
}
    ${BasicCreateEdgeMutationPayloadFragmentDoc}`;
export type ProfilePageFollowMutationFn = Apollo.MutationFunction<ProfilePageFollowMutation, ProfilePageFollowMutationVariables>;

/**
 * __useProfilePageFollowMutation__
 *
 * To run a mutation, you first call `useProfilePageFollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProfilePageFollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [profilePageFollowMutation, { data, loading, error }] = useProfilePageFollowMutation({
 *   variables: {
 *      currentProfileId: // value for 'currentProfileId'
 *      profileId: // value for 'profileId'
 *   },
 * });
 */
export function useProfilePageFollowMutation(baseOptions?: Apollo.MutationHookOptions<ProfilePageFollowMutation, ProfilePageFollowMutationVariables>) {
        return Apollo.useMutation<ProfilePageFollowMutation, ProfilePageFollowMutationVariables>(ProfilePageFollowDocument, baseOptions);
      }
export type ProfilePageFollowMutationHookResult = ReturnType<typeof useProfilePageFollowMutation>;
export type ProfilePageFollowMutationResult = Apollo.MutationResult<ProfilePageFollowMutation>;
export type ProfilePageFollowMutationOptions = Apollo.BaseMutationOptions<ProfilePageFollowMutation, ProfilePageFollowMutationVariables>;
export const ProfilePageUnfollowDocument = gql`
    mutation ProfilePageUnfollow($edgeId: ID!) {
  deleteEdge(input: {_id: $edgeId, edgeType: Follows}) {
    ...BasicDeleteEdgeMutationPayload
  }
}
    ${BasicDeleteEdgeMutationPayloadFragmentDoc}`;
export type ProfilePageUnfollowMutationFn = Apollo.MutationFunction<ProfilePageUnfollowMutation, ProfilePageUnfollowMutationVariables>;

/**
 * __useProfilePageUnfollowMutation__
 *
 * To run a mutation, you first call `useProfilePageUnfollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProfilePageUnfollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [profilePageUnfollowMutation, { data, loading, error }] = useProfilePageUnfollowMutation({
 *   variables: {
 *      edgeId: // value for 'edgeId'
 *   },
 * });
 */
export function useProfilePageUnfollowMutation(baseOptions?: Apollo.MutationHookOptions<ProfilePageUnfollowMutation, ProfilePageUnfollowMutationVariables>) {
        return Apollo.useMutation<ProfilePageUnfollowMutation, ProfilePageUnfollowMutationVariables>(ProfilePageUnfollowDocument, baseOptions);
      }
export type ProfilePageUnfollowMutationHookResult = ReturnType<typeof useProfilePageUnfollowMutation>;
export type ProfilePageUnfollowMutationResult = Apollo.MutationResult<ProfilePageUnfollowMutation>;
export type ProfilePageUnfollowMutationOptions = Apollo.BaseMutationOptions<ProfilePageUnfollowMutation, ProfilePageUnfollowMutationVariables>;