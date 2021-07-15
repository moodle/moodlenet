import * as Types from '../../../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type SubjectCardQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type SubjectCardQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<(
    { __typename: 'Collection' }
    & Pick<Types.Collection, 'name' | 'icon' | 'id'>
  ) | (
    { __typename: 'Profile' }
    & Pick<Types.Profile, 'name' | 'icon' | 'id'>
  ) | (
    { __typename: 'Resource' }
    & Pick<Types.Resource, 'name' | 'icon' | 'id'>
  ) | (
    { __typename: 'SubjectField' }
    & Pick<Types.SubjectField, 'name' | 'icon' | 'id'>
  )> }
);


export const SubjectCardDocument = gql`
    query SubjectCard($id: ID!) {
  node(id: $id) {
    ... on IContentNode {
      name
      icon
    }
    ... on INode {
      id
    }
  }
}
    `;

/**
 * __useSubjectCardQuery__
 *
 * To run a query within a React component, call `useSubjectCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubjectCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubjectCardQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSubjectCardQuery(baseOptions: Apollo.QueryHookOptions<SubjectCardQuery, SubjectCardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SubjectCardQuery, SubjectCardQueryVariables>(SubjectCardDocument, options);
      }
export function useSubjectCardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubjectCardQuery, SubjectCardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SubjectCardQuery, SubjectCardQueryVariables>(SubjectCardDocument, options);
        }
export type SubjectCardQueryHookResult = ReturnType<typeof useSubjectCardQuery>;
export type SubjectCardLazyQueryHookResult = ReturnType<typeof useSubjectCardLazyQuery>;
export type SubjectCardQueryResult = Apollo.QueryResult<SubjectCardQuery, SubjectCardQueryVariables>;