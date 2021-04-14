import * as Types from '../../../graphql/pub.graphql.link';

import { JustEdgeIdRelPageFragment } from '../../../hooks/content/fragments/relPage.gen';
import { gql } from '@apollo/client';
import { JustEdgeIdRelPageFragmentDoc } from '../../../hooks/content/fragments/relPage.gen';
import * as Apollo from '@apollo/client';
export type ResourcePageNodeQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type ResourcePageNodeQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<{ __typename: 'Collection' } | { __typename: 'Profile' } | (
    { __typename: 'Resource' }
    & Pick<Types.Resource, '_id' | 'name' | 'icon' | 'summary'>
    & { myLike: (
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
        & { Likes?: Types.Maybe<(
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
  ) | { __typename: 'Subject' }> }
);

export type ResourcePageResourcesQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type ResourcePageResourcesQuery = (
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
          & { resources: (
            { __typename: 'RelPage' }
            & { edges: Array<(
              { __typename: 'RelPageEdge' }
              & { node: { __typename: 'Collection' } | { __typename: 'Profile' } | (
                { __typename: 'Resource' }
                & Pick<Types.Resource, '_id' | 'name'>
              ) | { __typename: 'Subject' } }
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
          & { resources: (
            { __typename: 'RelPage' }
            & { edges: Array<(
              { __typename: 'RelPageEdge' }
              & { node: { __typename: 'Collection' } | { __typename: 'Profile' } | (
                { __typename: 'Resource' }
                & Pick<Types.Resource, '_id' | 'name'>
              ) | { __typename: 'Subject' } }
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
          & { resources: (
            { __typename: 'RelPage' }
            & { edges: Array<(
              { __typename: 'RelPageEdge' }
              & { node: { __typename: 'Collection' } | { __typename: 'Profile' } | (
                { __typename: 'Resource' }
                & Pick<Types.Resource, '_id' | 'name'>
              ) | { __typename: 'Subject' } }
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
          & { resources: (
            { __typename: 'RelPage' }
            & { edges: Array<(
              { __typename: 'RelPageEdge' }
              & { node: { __typename: 'Collection' } | { __typename: 'Profile' } | (
                { __typename: 'Resource' }
                & Pick<Types.Resource, '_id' | 'name'>
              ) | { __typename: 'Subject' } }
            )> }
          ) }
        ) | { __typename: 'Subject' } }
      )> }
    ) }
  )> }
);


export const ResourcePageNodeDocument = gql`
    query ResourcePageNode($id: ID!) {
  node(_id: $id) {
    ... on Resource {
      _id
      name
      icon
      summary
      myLike: _rel(
        edge: {type: Likes, node: Profile, inverse: true, targetMe: true}
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
          Likes {
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
 * __useResourcePageNodeQuery__
 *
 * To run a query within a React component, call `useResourcePageNodeQuery` and pass it any options that fit your needs.
 * When your component renders, `useResourcePageNodeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useResourcePageNodeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useResourcePageNodeQuery(baseOptions: Apollo.QueryHookOptions<ResourcePageNodeQuery, ResourcePageNodeQueryVariables>) {
        return Apollo.useQuery<ResourcePageNodeQuery, ResourcePageNodeQueryVariables>(ResourcePageNodeDocument, baseOptions);
      }
export function useResourcePageNodeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ResourcePageNodeQuery, ResourcePageNodeQueryVariables>) {
          return Apollo.useLazyQuery<ResourcePageNodeQuery, ResourcePageNodeQueryVariables>(ResourcePageNodeDocument, baseOptions);
        }
export type ResourcePageNodeQueryHookResult = ReturnType<typeof useResourcePageNodeQuery>;
export type ResourcePageNodeLazyQueryHookResult = ReturnType<typeof useResourcePageNodeLazyQuery>;
export type ResourcePageNodeQueryResult = Apollo.QueryResult<ResourcePageNodeQuery, ResourcePageNodeQueryVariables>;
export const ResourcePageResourcesDocument = gql`
    query ResourcePageResources($id: ID!) {
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
              resources: _rel(
                edge: {type: Contains, node: Resource, inverse: true}
                page: {first: 2}
              ) {
                edges {
                  node {
                    ... on Resource {
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
 * __useResourcePageResourcesQuery__
 *
 * To run a query within a React component, call `useResourcePageResourcesQuery` and pass it any options that fit your needs.
 * When your component renders, `useResourcePageResourcesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useResourcePageResourcesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useResourcePageResourcesQuery(baseOptions: Apollo.QueryHookOptions<ResourcePageResourcesQuery, ResourcePageResourcesQueryVariables>) {
        return Apollo.useQuery<ResourcePageResourcesQuery, ResourcePageResourcesQueryVariables>(ResourcePageResourcesDocument, baseOptions);
      }
export function useResourcePageResourcesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ResourcePageResourcesQuery, ResourcePageResourcesQueryVariables>) {
          return Apollo.useLazyQuery<ResourcePageResourcesQuery, ResourcePageResourcesQueryVariables>(ResourcePageResourcesDocument, baseOptions);
        }
export type ResourcePageResourcesQueryHookResult = ReturnType<typeof useResourcePageResourcesQuery>;
export type ResourcePageResourcesLazyQueryHookResult = ReturnType<typeof useResourcePageResourcesLazyQuery>;
export type ResourcePageResourcesQueryResult = Apollo.QueryResult<ResourcePageResourcesQuery, ResourcePageResourcesQueryVariables>;