import * as Types from '../../../graphql/pub.graphql.link';

import { JustEdgeIdRelPageFragment } from '../../../hooks/content/fragments/relPage.gen';
import { gql } from '@apollo/client';
import { JustEdgeIdRelPageFragmentDoc } from '../../../hooks/content/fragments/relPage.gen';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CollectionPageNodeQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type CollectionPageNodeQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<(
    { __typename: 'Collection' }
    & Pick<Types.Collection, 'id' | 'name' | 'summary' | 'icon'>
    & { followersCount: Types.Collection['_relCount'], resourcesCount: Types.Collection['_relCount'] }
    & { myFollow: (
      { __typename: 'RelPage' }
      & JustEdgeIdRelPageFragment
    ), _created: (
      { __typename: 'GlyphByAt' }
      & Pick<Types.GlyphByAt, 'at'>
      & { by: (
        { __typename: 'Profile' }
        & Pick<Types.Profile, 'id' | 'name' | 'icon'>
      ) }
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
    & Pick<Types.Collection, 'id'>
    & { resourceList: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
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
        ), node: { __typename: 'Collection' } | { __typename: 'Profile' } | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name' | 'icon'>
          & { collections: (
            { __typename: 'RelPage' }
            & { edges: Array<(
              { __typename: 'RelPageEdge' }
              & { node: (
                { __typename: 'Collection' }
                & Pick<Types.Collection, 'id' | 'name'>
              ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'Subject' } }
            )> }
          ) }
        ) | { __typename: 'Subject' } }
      )> }
    ) }
  ) | (
    { __typename: 'Profile' }
    & Pick<Types.Profile, 'id'>
    & { resourceList: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
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
        ), node: { __typename: 'Collection' } | { __typename: 'Profile' } | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name' | 'icon'>
          & { collections: (
            { __typename: 'RelPage' }
            & { edges: Array<(
              { __typename: 'RelPageEdge' }
              & { node: (
                { __typename: 'Collection' }
                & Pick<Types.Collection, 'id' | 'name'>
              ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'Subject' } }
            )> }
          ) }
        ) | { __typename: 'Subject' } }
      )> }
    ) }
  ) | (
    { __typename: 'Resource' }
    & Pick<Types.Resource, 'id'>
    & { resourceList: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
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
        ), node: { __typename: 'Collection' } | { __typename: 'Profile' } | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name' | 'icon'>
          & { collections: (
            { __typename: 'RelPage' }
            & { edges: Array<(
              { __typename: 'RelPageEdge' }
              & { node: (
                { __typename: 'Collection' }
                & Pick<Types.Collection, 'id' | 'name'>
              ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'Subject' } }
            )> }
          ) }
        ) | { __typename: 'Subject' } }
      )> }
    ) }
  ) | (
    { __typename: 'Subject' }
    & Pick<Types.Subject, 'id'>
    & { resourceList: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
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
        ), node: { __typename: 'Collection' } | { __typename: 'Profile' } | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name' | 'icon'>
          & { collections: (
            { __typename: 'RelPage' }
            & { edges: Array<(
              { __typename: 'RelPageEdge' }
              & { node: (
                { __typename: 'Collection' }
                & Pick<Types.Collection, 'id' | 'name'>
              ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'Subject' } }
            )> }
          ) }
        ) | { __typename: 'Subject' } }
      )> }
    ) }
  )> }
);


export const CollectionPageNodeDocument = gql`
    query CollectionPageNode($id: ID!) {
  node(id: $id) {
    ... on Collection {
      id
      name
      summary
      icon
      myFollow: _rel(
        edge: {type: Follows, node: Profile, inverse: true, targetMe: true}
        page: {first: 1}
      ) {
        ...JustEdgeIdRelPage
      }
      _created {
        at
        by {
          id
          name
          icon
        }
      }
      followersCount: _relCount(type: Follows, target: Profile, inverse: true)
      resourcesCount: _relCount(type: Contains, target: Resource)
    }
  }
}
    ${JustEdgeIdRelPageFragmentDoc}`;

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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionPageNodeQuery, CollectionPageNodeQueryVariables>(CollectionPageNodeDocument, options);
      }
export function useCollectionPageNodeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionPageNodeQuery, CollectionPageNodeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionPageNodeQuery, CollectionPageNodeQueryVariables>(CollectionPageNodeDocument, options);
        }
export type CollectionPageNodeQueryHookResult = ReturnType<typeof useCollectionPageNodeQuery>;
export type CollectionPageNodeLazyQueryHookResult = ReturnType<typeof useCollectionPageNodeLazyQuery>;
export type CollectionPageNodeQueryResult = Apollo.QueryResult<CollectionPageNodeQuery, CollectionPageNodeQueryVariables>;
export const CollectionPageResourcesDocument = gql`
    query CollectionPageResources($id: ID!) {
  node(id: $id) {
    ... on INode {
      id
      resourceList: _rel(edge: {type: Contains, node: Resource}, page: {first: 10}) {
        edges {
          edge {
            id
          }
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionPageResourcesQuery, CollectionPageResourcesQueryVariables>(CollectionPageResourcesDocument, options);
      }
export function useCollectionPageResourcesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionPageResourcesQuery, CollectionPageResourcesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionPageResourcesQuery, CollectionPageResourcesQueryVariables>(CollectionPageResourcesDocument, options);
        }
export type CollectionPageResourcesQueryHookResult = ReturnType<typeof useCollectionPageResourcesQuery>;
export type CollectionPageResourcesLazyQueryHookResult = ReturnType<typeof useCollectionPageResourcesLazyQuery>;
export type CollectionPageResourcesQueryResult = Apollo.QueryResult<CollectionPageResourcesQuery, CollectionPageResourcesQueryVariables>;