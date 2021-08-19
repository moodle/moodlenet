import * as Types from '../../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type BookmarksPageQueryVariables = Types.Exact<{
  profileId: Types.Scalars['ID'];
}>;


export type BookmarksPageQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<{ __typename: 'Collection' } | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | (
    { __typename: 'Profile' }
    & Pick<Types.Profile, 'id'>
    & { collections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { edge: (
          { __typename: 'Bookmarked' }
          & Pick<Types.Bookmarked, 'id'>
        ) | (
          { __typename: 'Created' }
          & Pick<Types.Created, 'id'>
        ) | (
          { __typename: 'Features' }
          & Pick<Types.Features, 'id'>
        ) | (
          { __typename: 'Follows' }
          & Pick<Types.Follows, 'id'>
        ) | (
          { __typename: 'Likes' }
          & Pick<Types.Likes, 'id'>
        ) | (
          { __typename: 'Pinned' }
          & Pick<Types.Pinned, 'id'>
        ), node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id'>
        ) | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ), resources: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { edge: (
          { __typename: 'Bookmarked' }
          & Pick<Types.Bookmarked, 'id'>
        ) | (
          { __typename: 'Created' }
          & Pick<Types.Created, 'id'>
        ) | (
          { __typename: 'Features' }
          & Pick<Types.Features, 'id'>
        ) | (
          { __typename: 'Follows' }
          & Pick<Types.Follows, 'id'>
        ) | (
          { __typename: 'Likes' }
          & Pick<Types.Likes, 'id'>
        ) | (
          { __typename: 'Pinned' }
          & Pick<Types.Pinned, 'id'>
        ), node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id'>
        ) | { __typename: 'ResourceType' } }
      )> }
    ) }
  ) | { __typename: 'Resource' } | { __typename: 'ResourceType' }> }
);


export const BookmarksPageDocument = gql`
    query bookmarksPage($profileId: ID!) {
  node(id: $profileId) {
    ... on Profile {
      id
      collections: _rel(type: Bookmarked, target: Collection, page: {first: 100}) {
        edges {
          edge {
            id
          }
          node {
            ... on Collection {
              id
            }
          }
        }
      }
      resources: _rel(type: Bookmarked, target: Resource, page: {first: 100}) {
        edges {
          edge {
            id
          }
          node {
            ... on Resource {
              id
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useBookmarksPageQuery__
 *
 * To run a query within a React component, call `useBookmarksPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useBookmarksPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBookmarksPageQuery({
 *   variables: {
 *      profileId: // value for 'profileId'
 *   },
 * });
 */
export function useBookmarksPageQuery(baseOptions: Apollo.QueryHookOptions<BookmarksPageQuery, BookmarksPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BookmarksPageQuery, BookmarksPageQueryVariables>(BookmarksPageDocument, options);
      }
export function useBookmarksPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BookmarksPageQuery, BookmarksPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BookmarksPageQuery, BookmarksPageQueryVariables>(BookmarksPageDocument, options);
        }
export type BookmarksPageQueryHookResult = ReturnType<typeof useBookmarksPageQuery>;
export type BookmarksPageLazyQueryHookResult = ReturnType<typeof useBookmarksPageLazyQuery>;
export type BookmarksPageQueryResult = Apollo.QueryResult<BookmarksPageQuery, BookmarksPageQueryVariables>;