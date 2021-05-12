import * as Types from '../../../graphql/pub.graphql.link';

import { JustEdgeIdRelPageFragment } from '../../../hooks/content/fragments/relPage.gen';
import { gql } from '@apollo/client';
import { JustEdgeIdRelPageFragmentDoc } from '../../../hooks/content/fragments/relPage.gen';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type SubjectPageNodeQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type SubjectPageNodeQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<{ __typename: 'Collection' } | { __typename: 'Profile' } | { __typename: 'Resource' } | (
    { __typename: 'Subject' }
    & Pick<Types.Subject, 'id' | 'name' | 'summary'>
    & { appliesToCollectionsCount: Types.Subject['_relCount'], appliesToResourcesCount: Types.Subject['_relCount'], inCollectionCount: Types.Subject['_relCount'], followersCount: Types.Subject['_relCount'] }
    & { myFollow: (
      { __typename: 'RelPage' }
      & JustEdgeIdRelPageFragment
    ) }
  )> }
);

export type SubjectPageCollectionsQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type SubjectPageCollectionsQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<(
    { __typename: 'Collection' }
    & Pick<Types.Collection, 'id'>
    & { collectionList: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name' | 'icon'>
          & { followersCount: Types.Collection['_relCount'], resourcesCount: Types.Collection['_relCount'] }
        ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'Subject' } }
      )> }
    ) }
  ) | (
    { __typename: 'Profile' }
    & Pick<Types.Profile, 'id'>
    & { collectionList: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name' | 'icon'>
          & { followersCount: Types.Collection['_relCount'], resourcesCount: Types.Collection['_relCount'] }
        ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'Subject' } }
      )> }
    ) }
  ) | (
    { __typename: 'Resource' }
    & Pick<Types.Resource, 'id'>
    & { collectionList: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name' | 'icon'>
          & { followersCount: Types.Collection['_relCount'], resourcesCount: Types.Collection['_relCount'] }
        ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'Subject' } }
      )> }
    ) }
  ) | (
    { __typename: 'Subject' }
    & Pick<Types.Subject, 'id'>
    & { collectionList: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name' | 'icon'>
          & { followersCount: Types.Collection['_relCount'], resourcesCount: Types.Collection['_relCount'] }
        ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'Subject' } }
      )> }
    ) }
  )> }
);

export type SubjectPageResourcesQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type SubjectPageResourcesQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<(
    { __typename: 'Collection' }
    & Pick<Types.Collection, 'id'>
    & { resourceList: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'Profile' } | (
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
        & { node: { __typename: 'Collection' } | { __typename: 'Profile' } | (
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
        & { node: { __typename: 'Collection' } | { __typename: 'Profile' } | (
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
        & { node: { __typename: 'Collection' } | { __typename: 'Profile' } | (
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


export const SubjectPageNodeDocument = gql`
    query SubjectPageNode($id: ID!) {
  node(id: $id) {
    ... on Subject {
      id
      name
      summary
      myFollow: _rel(
        edge: {type: Follows, node: Profile, inverse: true, targetMe: true}
        page: {first: 1}
      ) {
        ...JustEdgeIdRelPage
      }
      appliesToCollectionsCount: _relCount(type: AppliesTo, target: Collection)
      appliesToResourcesCount: _relCount(type: AppliesTo, target: Resource)
      inCollectionCount: _relCount(type: Contains, target: Resource, inverse: true)
      followersCount: _relCount(type: Follows, target: Profile, inverse: true)
    }
  }
}
    ${JustEdgeIdRelPageFragmentDoc}`;

/**
 * __useSubjectPageNodeQuery__
 *
 * To run a query within a React component, call `useSubjectPageNodeQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubjectPageNodeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubjectPageNodeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSubjectPageNodeQuery(baseOptions: Apollo.QueryHookOptions<SubjectPageNodeQuery, SubjectPageNodeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SubjectPageNodeQuery, SubjectPageNodeQueryVariables>(SubjectPageNodeDocument, options);
      }
export function useSubjectPageNodeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubjectPageNodeQuery, SubjectPageNodeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SubjectPageNodeQuery, SubjectPageNodeQueryVariables>(SubjectPageNodeDocument, options);
        }
export type SubjectPageNodeQueryHookResult = ReturnType<typeof useSubjectPageNodeQuery>;
export type SubjectPageNodeLazyQueryHookResult = ReturnType<typeof useSubjectPageNodeLazyQuery>;
export type SubjectPageNodeQueryResult = Apollo.QueryResult<SubjectPageNodeQuery, SubjectPageNodeQueryVariables>;
export const SubjectPageCollectionsDocument = gql`
    query SubjectPageCollections($id: ID!) {
  node(id: $id) {
    ... on INode {
      id
      collectionList: _rel(
        edge: {type: AppliesTo, node: Collection}
        page: {first: 10}
      ) {
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
 * __useSubjectPageCollectionsQuery__
 *
 * To run a query within a React component, call `useSubjectPageCollectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubjectPageCollectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubjectPageCollectionsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSubjectPageCollectionsQuery(baseOptions: Apollo.QueryHookOptions<SubjectPageCollectionsQuery, SubjectPageCollectionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SubjectPageCollectionsQuery, SubjectPageCollectionsQueryVariables>(SubjectPageCollectionsDocument, options);
      }
export function useSubjectPageCollectionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubjectPageCollectionsQuery, SubjectPageCollectionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SubjectPageCollectionsQuery, SubjectPageCollectionsQueryVariables>(SubjectPageCollectionsDocument, options);
        }
export type SubjectPageCollectionsQueryHookResult = ReturnType<typeof useSubjectPageCollectionsQuery>;
export type SubjectPageCollectionsLazyQueryHookResult = ReturnType<typeof useSubjectPageCollectionsLazyQuery>;
export type SubjectPageCollectionsQueryResult = Apollo.QueryResult<SubjectPageCollectionsQuery, SubjectPageCollectionsQueryVariables>;
export const SubjectPageResourcesDocument = gql`
    query SubjectPageResources($id: ID!) {
  node(id: $id) {
    ... on INode {
      id
      resourceList: _rel(edge: {type: AppliesTo, node: Resource}, page: {first: 10}) {
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
 * __useSubjectPageResourcesQuery__
 *
 * To run a query within a React component, call `useSubjectPageResourcesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubjectPageResourcesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubjectPageResourcesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSubjectPageResourcesQuery(baseOptions: Apollo.QueryHookOptions<SubjectPageResourcesQuery, SubjectPageResourcesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SubjectPageResourcesQuery, SubjectPageResourcesQueryVariables>(SubjectPageResourcesDocument, options);
      }
export function useSubjectPageResourcesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubjectPageResourcesQuery, SubjectPageResourcesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SubjectPageResourcesQuery, SubjectPageResourcesQueryVariables>(SubjectPageResourcesDocument, options);
        }
export type SubjectPageResourcesQueryHookResult = ReturnType<typeof useSubjectPageResourcesQuery>;
export type SubjectPageResourcesLazyQueryHookResult = ReturnType<typeof useSubjectPageResourcesLazyQuery>;
export type SubjectPageResourcesQueryResult = Apollo.QueryResult<SubjectPageResourcesQuery, SubjectPageResourcesQueryVariables>;