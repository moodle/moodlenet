import * as Types from '../../../graphql/pub.graphql.link';

import { JustEdgeIdRelPageFragment } from '../../../hooks/content/fragments/relPage.gen';
import { gql } from '@apollo/client';
import { JustEdgeIdRelPageFragmentDoc } from '../../../hooks/content/fragments/relPage.gen';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type ResourcePageNodeQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type ResourcePageNodeQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<{ __typename: 'Collection' } | { __typename: 'Profile' } | (
    { __typename: 'Resource' }
    & Pick<Types.Resource, 'id' | 'name' | 'icon' | 'asset' | 'summary'>
    & { likersCount: Types.Resource['_relCount'], inCollectionCount: Types.Resource['_relCount'] }
    & { myLike: (
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
  ) | { __typename: 'Subject' }> }
);


export const ResourcePageNodeDocument = gql`
    query ResourcePageNode($id: ID!) {
  node(id: $id) {
    ... on Resource {
      id
      name
      icon
      asset
      summary
      myLike: _rel(
        edge: {type: Likes, node: Profile, inverse: true, targetMe: true}
        page: {first: 1}
      ) {
        ...JustEdgeIdRelPage
      }
      likersCount: _relCount(type: Likes, target: Profile, inverse: true)
      inCollectionCount: _relCount(type: Contains, target: Resource, inverse: true)
      _created {
        at
        by {
          id
          name
          icon
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ResourcePageNodeQuery, ResourcePageNodeQueryVariables>(ResourcePageNodeDocument, options);
      }
export function useResourcePageNodeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ResourcePageNodeQuery, ResourcePageNodeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ResourcePageNodeQuery, ResourcePageNodeQueryVariables>(ResourcePageNodeDocument, options);
        }
export type ResourcePageNodeQueryHookResult = ReturnType<typeof useResourcePageNodeQuery>;
export type ResourcePageNodeLazyQueryHookResult = ReturnType<typeof useResourcePageNodeLazyQuery>;
export type ResourcePageNodeQueryResult = Apollo.QueryResult<ResourcePageNodeQuery, ResourcePageNodeQueryVariables>;