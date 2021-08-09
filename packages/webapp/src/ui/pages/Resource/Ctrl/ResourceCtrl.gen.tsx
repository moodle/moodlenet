import * as Apollo from '@apollo/client';
import { gql } from '@apollo/client';
import * as Types from '../../../../graphql/pub.graphql.link';

const defaultOptions =  {}
export type ResourcePageUserDataQueryVariables = Types.Exact<{
  ResourceId: Types.Scalars['ID'];
}>;


export type ResourcePageUserDataQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<{ __typename: 'Collection' } | { __typename: 'Iscedf' } | { __typename: 'OpBadge' } | { __typename: 'Organization' } | (
    { __typename: 'Resource' }
    & Pick<Types.Resource, 'id' | 'name' | 'avatar' | 'bio' | 'image' | 'firstName' | 'lastName' | 'siteUrl' | 'location'>
    & { followersCount: Types.Resource['_relCount'], collectionsCount: Types.Resource['_relCount'], resourcesCount: Types.Resource['_relCount'] }
    & { collections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name' | 'image'>
        ) | { __typename: 'Iscedf' } | { __typename: 'OpBadge' } | { __typename: 'Organization' } | { __typename: 'Resource' } | { __typename: 'Resource' } }
      )> }
    ), resources: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'Iscedf' } | { __typename: 'OpBadge' } | { __typename: 'Organization' } | { __typename: 'Resource' } | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name' | 'thumbnail'>
        ) }
      )> }
    ) }
  ) | { __typename: 'Resource' }> }
);


export const ResourcePageUserDataDocument = gql`
    query ResourcePageUserData($ResourceId: ID!) {
  node(id: $ResourceId) {
    ... on Resource {
      id
      name
      avatar
      bio
      image
      firstName
      lastName
      siteUrl
      location
      followersCount: _relCount(type: Follows, target: Resource, inverse: true)
      collectionsCount: _relCount(type: Created, target: Collection)
      collections: _rel(type: Created, target: Collection, page: {first: 100}) {
        edges {
          node {
            ... on Collection {
              id
              name
              image
            }
          }
        }
      }
      resourcesCount: _relCount(type: Created, target: Resource)
      resources: _rel(type: Created, target: Resource, page: {first: 100}) {
        edges {
          node {
            ... on Resource {
              id
              name
              thumbnail
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useResourcePageUserDataQuery__
 *
 * To run a query within a React component, call `useResourcePageUserDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useResourcePageUserDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useResourcePageUserDataQuery({
 *   variables: {
 *      ResourceId: // value for 'ResourceId'
 *   },
 * });
 */
export function useResourcePageUserDataQuery(baseOptions: Apollo.QueryHookOptions<ResourcePageUserDataQuery, ResourcePageUserDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ResourcePageUserDataQuery, ResourcePageUserDataQueryVariables>(ResourcePageUserDataDocument, options);
      }
export function useResourcePageUserDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ResourcePageUserDataQuery, ResourcePageUserDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ResourcePageUserDataQuery, ResourcePageUserDataQueryVariables>(ResourcePageUserDataDocument, options);
        }
export type ResourcePageUserDataQueryHookResult = ReturnType<typeof useResourcePageUserDataQuery>;
export type ResourcePageUserDataLazyQueryHookResult = ReturnType<typeof useResourcePageUserDataLazyQuery>;
export type ResourcePageUserDataQueryResult = Apollo.QueryResult<ResourcePageUserDataQuery, ResourcePageUserDataQueryVariables>;