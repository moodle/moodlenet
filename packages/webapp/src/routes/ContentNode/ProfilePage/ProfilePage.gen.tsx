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
    & Pick<Types.Profile, 'id' | 'name' | 'icon' | 'summary'>
    & { followersCount: Types.Profile['_relCount'] }
    & { myFollow: Types.Maybe<(
      { __typename: 'RelPage' }
      & JustEdgeIdRelPageFragment
    )> }
  ) | { __typename: 'Resource' } | { __typename: 'Subject' }> }
);

export type ProfilePageOwnCollectionsQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type ProfilePageOwnCollectionsQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<(
    { __typename: 'Collection' }
    & Pick<Types.Collection, 'id'>
    & { ownCollections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Profile' } | (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name' | 'icon'>
          & { followersCount: Types.Collection['_relCount'], resourcesCount: Types.Collection['_relCount'] }
        ) | { __typename: 'Resource' } | { __typename: 'Subject' } }
      )> }
    ) }
  ) | (
    { __typename: 'Profile' }
    & Pick<Types.Profile, 'id'>
    & { ownCollections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Profile' } | (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name' | 'icon'>
          & { followersCount: Types.Collection['_relCount'], resourcesCount: Types.Collection['_relCount'] }
        ) | { __typename: 'Resource' } | { __typename: 'Subject' } }
      )> }
    ) }
  ) | (
    { __typename: 'Resource' }
    & Pick<Types.Resource, 'id'>
    & { ownCollections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Profile' } | (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name' | 'icon'>
          & { followersCount: Types.Collection['_relCount'], resourcesCount: Types.Collection['_relCount'] }
        ) | { __typename: 'Resource' } | { __typename: 'Subject' } }
      )> }
    ) }
  ) | (
    { __typename: 'Subject' }
    & Pick<Types.Subject, 'id'>
    & { ownCollections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Profile' } | (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name' | 'icon'>
          & { followersCount: Types.Collection['_relCount'], resourcesCount: Types.Collection['_relCount'] }
        ) | { __typename: 'Resource' } | { __typename: 'Subject' } }
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
    & Pick<Types.Collection, 'id'>
    & { ownResources: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Profile' } | { __typename: 'Collection' } | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name' | 'icon'>
          & { collections: (
            { __typename: 'RelPage' }
            & { edges: Array<(
              { __typename: 'RelPageEdge' }
              & { node: { __typename: 'Profile' } | (
                { __typename: 'Collection' }
                & Pick<Types.Collection, 'id' | 'name'>
              ) | { __typename: 'Resource' } | { __typename: 'Subject' } }
            )> }
          ) }
        ) | { __typename: 'Subject' } }
      )> }
    ) }
  ) | (
    { __typename: 'Profile' }
    & Pick<Types.Profile, 'id'>
    & { ownResources: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Profile' } | { __typename: 'Collection' } | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name' | 'icon'>
          & { collections: (
            { __typename: 'RelPage' }
            & { edges: Array<(
              { __typename: 'RelPageEdge' }
              & { node: { __typename: 'Profile' } | (
                { __typename: 'Collection' }
                & Pick<Types.Collection, 'id' | 'name'>
              ) | { __typename: 'Resource' } | { __typename: 'Subject' } }
            )> }
          ) }
        ) | { __typename: 'Subject' } }
      )> }
    ) }
  ) | (
    { __typename: 'Resource' }
    & Pick<Types.Resource, 'id'>
    & { ownResources: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Profile' } | { __typename: 'Collection' } | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name' | 'icon'>
          & { collections: (
            { __typename: 'RelPage' }
            & { edges: Array<(
              { __typename: 'RelPageEdge' }
              & { node: { __typename: 'Profile' } | (
                { __typename: 'Collection' }
                & Pick<Types.Collection, 'id' | 'name'>
              ) | { __typename: 'Resource' } | { __typename: 'Subject' } }
            )> }
          ) }
        ) | { __typename: 'Subject' } }
      )> }
    ) }
  ) | (
    { __typename: 'Subject' }
    & Pick<Types.Subject, 'id'>
    & { ownResources: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Profile' } | { __typename: 'Collection' } | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name' | 'icon'>
          & { collections: (
            { __typename: 'RelPage' }
            & { edges: Array<(
              { __typename: 'RelPageEdge' }
              & { node: { __typename: 'Profile' } | (
                { __typename: 'Collection' }
                & Pick<Types.Collection, 'id' | 'name'>
              ) | { __typename: 'Resource' } | { __typename: 'Subject' } }
            )> }
          ) }
        ) | { __typename: 'Subject' } }
      )> }
    ) }
  )> }
);


export const ProfilePageNodeDocument = gql`
    query ProfilePageNode($id: ID!, $skipMyRel: Boolean!) {
  node(id: $id) {
    ... on Profile {
      id
      name
      icon
      summary
      myFollow: _rel(
        edge: {type: Follows, node: Profile, inverse: true, targetMe: true}
        page: {first: 1}
      ) @skip(if: $skipMyRel) {
        ...JustEdgeIdRelPage
      }
      followersCount: _relCount(type: Follows, target: Profile, inverse: true)
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
  node(id: $id) {
    ... on INode {
      id
      ownCollections: _rel(edge: {type: Created, node: Collection}, page: {first: 5}) {
        edges {
          node {
            ... on Collection {
              id
              name
              icon
              followersCount: _relCount(type: Follows, target: Profile, inverse: true)
              resourcesCount: _relCount(type: Contains, target: Resource)
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
  node(id: $id) {
    ... on INode {
      id
      ownResources: _rel(edge: {type: Created, node: Resource}, page: {first: 5}) {
        edges {
          node {
            ... on Resource {
              id
              name
              icon
              collections: _rel(
                edge: {type: Contains, node: Collection, inverse: true}
                page: {first: 2}
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