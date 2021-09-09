import * as Types from '../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type SeoContentQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type SeoContentQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<(
    { __typename: 'Collection' }
    & Pick<Types.Collection, 'id' | 'name' | 'description'>
  ) | (
    { __typename: 'FileFormat' }
    & Pick<Types.FileFormat, 'id' | 'name' | 'description'>
  ) | (
    { __typename: 'IscedField' }
    & Pick<Types.IscedField, 'id' | 'name' | 'description'>
  ) | (
    { __typename: 'IscedGrade' }
    & Pick<Types.IscedGrade, 'id' | 'name' | 'description'>
  ) | (
    { __typename: 'Language' }
    & Pick<Types.Language, 'id' | 'name' | 'description'>
  ) | (
    { __typename: 'License' }
    & Pick<Types.License, 'id' | 'name' | 'description'>
  ) | (
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'name' | 'description'>
  ) | (
    { __typename: 'Profile' }
    & Pick<Types.Profile, 'id' | 'name' | 'description'>
  ) | (
    { __typename: 'Resource' }
    & Pick<Types.Resource, 'id' | 'name' | 'description'>
  ) | (
    { __typename: 'ResourceType' }
    & Pick<Types.ResourceType, 'id' | 'name' | 'description'>
  )> }
);


export const SeoContentDocument = gql`
    query seoContent($id: ID!) {
  node(id: $id) {
    ... on INode {
      id
      name
      description
    }
  }
}
    `;

/**
 * __useSeoContentQuery__
 *
 * To run a query within a React component, call `useSeoContentQuery` and pass it any options that fit your needs.
 * When your component renders, `useSeoContentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSeoContentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSeoContentQuery(baseOptions: Apollo.QueryHookOptions<SeoContentQuery, SeoContentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SeoContentQuery, SeoContentQueryVariables>(SeoContentDocument, options);
      }
export function useSeoContentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SeoContentQuery, SeoContentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SeoContentQuery, SeoContentQueryVariables>(SeoContentDocument, options);
        }
export type SeoContentQueryHookResult = ReturnType<typeof useSeoContentQuery>;
export type SeoContentLazyQueryHookResult = ReturnType<typeof useSeoContentLazyQuery>;
export type SeoContentQueryResult = Apollo.QueryResult<SeoContentQuery, SeoContentQueryVariables>;