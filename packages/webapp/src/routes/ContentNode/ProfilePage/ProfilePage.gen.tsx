import * as Types from '../../../graphql/pub.graphql.link';

import { JustEdgeIdRelPageFragment } from '../../../hooks/content/fragments/relPage.gen';
import { gql } from '@apollo/client';
import { JustEdgeIdRelPageFragmentDoc } from '../../../hooks/content/fragments/relPage.gen';
import * as Apollo from '@apollo/client';
export type ProfilePageNodeQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  skipMyRel: Types.Scalars['Boolean'];
}>;


export type ProfilePageNodeQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<{ __typename: 'Collection' } | (
    { __typename: 'Profile' }
    & Pick<Types.Profile, '_id' | 'name' | 'icon' | 'summary'>
    & { myFollow: Types.Maybe<(
      { __typename: 'RelPage' }
      & JustEdgeIdRelPageFragment
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


export const ProfilePageNodeDocument = gql`
    query ProfilePageNode($id: ID!, $skipMyRel: Boolean!) {
  node(_id: $id) {
    ... on Profile {
      _id
      name
      icon
      summary
      myFollow: _rel(
        edge: {type: Follows, node: Profile, inverse: true, targetMe: true}
        page: {first: 1}
      ) @skip(if: $skipMyRel) {
        ...JustEdgeIdRelPage
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
    ${JustEdgeIdRelPageFragmentDoc}`;

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
 *      skipMyRel: // value for 'skipMyRel'
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