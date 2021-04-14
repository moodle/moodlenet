import * as Types from '../../../graphql/pub.graphql.link';

import { JustEdgeIdRelPageFragment } from '../../../hooks/content/fragments/relPage.gen';
import { gql } from '@apollo/client';
import { JustEdgeIdRelPageFragmentDoc } from '../../../hooks/content/fragments/relPage.gen';
import * as Apollo from '@apollo/client';
export type CollectionPageNodeQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type CollectionPageNodeQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<(
    { __typename: 'Collection' }
    & Pick<Types.Collection, '_id' | 'name' | 'summary' | 'icon'>
    & { myFollow: (
      { __typename: 'RelPage' }
      & JustEdgeIdRelPageFragment
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
        ), node: { __typename: 'Collection' } | { __typename: 'Profile' } | (
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
        ), node: { __typename: 'Collection' } | { __typename: 'Profile' } | (
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
        ), node: { __typename: 'Collection' } | { __typename: 'Profile' } | (
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
        ), node: { __typename: 'Collection' } | { __typename: 'Profile' } | (
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


export const CollectionPageNodeDocument = gql`
    query CollectionPageNode($id: ID!) {
  node(_id: $id) {
    ... on Collection {
      _id
      name
      summary
      icon
      myFollow: _rel(
        edge: {type: Follows, node: Profile, inverse: true, targetMe: true}
        page: {first: 1}
      ) {
        ...JustEdgeIdRelPage
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
          edge {
            _id
          }
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