import * as Types from '../../../graphql/pub.graphql.link';

import { JustEdgeIdRelPageFragment } from '../../../hooks/content/fragments/relPage.gen';
import { gql } from '@apollo/client';
import { JustEdgeIdRelPageFragmentDoc } from '../../../hooks/content/fragments/relPage.gen';
import * as Apollo from '@apollo/client';
export type SubjectPageNodeQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type SubjectPageNodeQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<{ __typename: 'Collection' } | { __typename: 'Profile' } | { __typename: 'Resource' } | (
    { __typename: 'Subject' }
    & Pick<Types.Subject, '_id' | 'name' | 'summary'>
    & { myFollow: (
      { __typename: 'RelPage' }
      & JustEdgeIdRelPageFragment
    ), _meta: (
      { __typename: 'NodeMeta' }
      & { relCount?: Types.Maybe<(
        { __typename: 'RelCountMap' }
        & { Follows?: Types.Maybe<(
          { __typename: 'RelCount' }
          & { from?: Types.Maybe<(
            { __typename: 'RelCountTargetMap' }
            & Pick<Types.RelCountTargetMap, 'Profile'>
          )> }
        )>, AppliesTo?: Types.Maybe<(
          { __typename: 'RelCount' }
          & { to?: Types.Maybe<(
            { __typename: 'RelCountTargetMap' }
            & Pick<Types.RelCountTargetMap, 'Collection' | 'Resource'>
          )> }
        )> }
      )> }
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
    & Pick<Types.Collection, '_id'>
    & { collectionList: (
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
        ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'Subject' } }
      )> }
    ) }
  ) | (
    { __typename: 'Profile' }
    & Pick<Types.Profile, '_id'>
    & { collectionList: (
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
        ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'Subject' } }
      )> }
    ) }
  ) | (
    { __typename: 'Resource' }
    & Pick<Types.Resource, '_id'>
    & { collectionList: (
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
        ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'Subject' } }
      )> }
    ) }
  ) | (
    { __typename: 'Subject' }
    & Pick<Types.Subject, '_id'>
    & { collectionList: (
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


export const SubjectPageNodeDocument = gql`
    query SubjectPageNode($id: ID!) {
  node(_id: $id) {
    ... on Subject {
      _id
      name
      summary
      myFollow: _rel(
        edge: {type: Follows, node: Profile, inverse: true, targetMe: true}
        page: {first: 1}
      ) {
        ...JustEdgeIdRelPage
      }
      _meta {
        relCount {
          Follows {
            from {
              Profile
            }
          }
          AppliesTo {
            to {
              Collection
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
        return Apollo.useQuery<SubjectPageNodeQuery, SubjectPageNodeQueryVariables>(SubjectPageNodeDocument, baseOptions);
      }
export function useSubjectPageNodeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubjectPageNodeQuery, SubjectPageNodeQueryVariables>) {
          return Apollo.useLazyQuery<SubjectPageNodeQuery, SubjectPageNodeQueryVariables>(SubjectPageNodeDocument, baseOptions);
        }
export type SubjectPageNodeQueryHookResult = ReturnType<typeof useSubjectPageNodeQuery>;
export type SubjectPageNodeLazyQueryHookResult = ReturnType<typeof useSubjectPageNodeLazyQuery>;
export type SubjectPageNodeQueryResult = Apollo.QueryResult<SubjectPageNodeQuery, SubjectPageNodeQueryVariables>;
export const SubjectPageCollectionsDocument = gql`
    query SubjectPageCollections($id: ID!) {
  node(_id: $id) {
    ... on INode {
      _id
      collectionList: _rel(
        edge: {type: AppliesTo, node: Collection}
        page: {first: 10}
      ) {
        edges {
          node {
            ... on Collection {
              _id
              name
              icon
              _meta {
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
        return Apollo.useQuery<SubjectPageCollectionsQuery, SubjectPageCollectionsQueryVariables>(SubjectPageCollectionsDocument, baseOptions);
      }
export function useSubjectPageCollectionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubjectPageCollectionsQuery, SubjectPageCollectionsQueryVariables>) {
          return Apollo.useLazyQuery<SubjectPageCollectionsQuery, SubjectPageCollectionsQueryVariables>(SubjectPageCollectionsDocument, baseOptions);
        }
export type SubjectPageCollectionsQueryHookResult = ReturnType<typeof useSubjectPageCollectionsQuery>;
export type SubjectPageCollectionsLazyQueryHookResult = ReturnType<typeof useSubjectPageCollectionsLazyQuery>;
export type SubjectPageCollectionsQueryResult = Apollo.QueryResult<SubjectPageCollectionsQuery, SubjectPageCollectionsQueryVariables>;
export const SubjectPageResourcesDocument = gql`
    query SubjectPageResources($id: ID!) {
  node(_id: $id) {
    ... on INode {
      _id
      resourceList: _rel(edge: {type: AppliesTo, node: Resource}, page: {first: 10}) {
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
        return Apollo.useQuery<SubjectPageResourcesQuery, SubjectPageResourcesQueryVariables>(SubjectPageResourcesDocument, baseOptions);
      }
export function useSubjectPageResourcesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubjectPageResourcesQuery, SubjectPageResourcesQueryVariables>) {
          return Apollo.useLazyQuery<SubjectPageResourcesQuery, SubjectPageResourcesQueryVariables>(SubjectPageResourcesDocument, baseOptions);
        }
export type SubjectPageResourcesQueryHookResult = ReturnType<typeof useSubjectPageResourcesQuery>;
export type SubjectPageResourcesLazyQueryHookResult = ReturnType<typeof useSubjectPageResourcesLazyQuery>;
export type SubjectPageResourcesQueryResult = Apollo.QueryResult<SubjectPageResourcesQuery, SubjectPageResourcesQueryVariables>;