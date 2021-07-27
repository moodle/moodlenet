import * as Apollo from '@apollo/client'
import { gql } from '@apollo/client'
import * as Types from '../../../../../graphql/pub.graphql.link'

const defaultOptions = {}
export type CollectionCardQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']
}>

export type CollectionCardQuery = { __typename: 'Query' } & {
  node?: Types.Maybe<
    | ({ __typename: 'Collection' } & Pick<Types.Collection, 'name' | 'icon' | 'id'> & {
          _organization?: Types.Maybe<{ __typename: 'Organization' } & Pick<Types.Organization, 'name'>>
        })
    | ({ __typename: 'Organization' } & Pick<Types.Organization, 'name' | 'icon' | 'id'> & {
          _organization?: Types.Maybe<{ __typename: 'Organization' } & Pick<Types.Organization, 'name'>>
        })
    | ({ __typename: 'Profile' } & Pick<Types.Profile, 'name' | 'icon' | 'id'> & {
          _organization?: Types.Maybe<{ __typename: 'Organization' } & Pick<Types.Organization, 'name'>>
        })
    | ({ __typename: 'Resource' } & Pick<Types.Resource, 'name' | 'icon' | 'id'> & {
          _organization?: Types.Maybe<{ __typename: 'Organization' } & Pick<Types.Organization, 'name'>>
        })
    | ({ __typename: 'Iscedf' } & Pick<Types.Iscedf, 'name' | 'icon' | 'id'> & {
          _organization?: Types.Maybe<{ __typename: 'Organization' } & Pick<Types.Organization, 'name'>>
        })
  >
}

export const CollectionCardDocument = gql`
  query CollectionCard($id: ID!) {
    node(id: $id) {
      ... on IContentNode {
        name
        icon
      }
      ... on INode {
        id
        _organization {
          name
        }
      }
    }
  }
`

/**
 * __useCollectionCardQuery__
 *
 * To run a query within a React component, call `useCollectionCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionCardQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCollectionCardQuery(
  baseOptions: Apollo.QueryHookOptions<CollectionCardQuery, CollectionCardQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<CollectionCardQuery, CollectionCardQueryVariables>(CollectionCardDocument, options)
}
export function useCollectionCardLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CollectionCardQuery, CollectionCardQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<CollectionCardQuery, CollectionCardQueryVariables>(CollectionCardDocument, options)
}
export type CollectionCardQueryHookResult = ReturnType<typeof useCollectionCardQuery>
export type CollectionCardLazyQueryHookResult = ReturnType<typeof useCollectionCardLazyQuery>
export type CollectionCardQueryResult = Apollo.QueryResult<CollectionCardQuery, CollectionCardQueryVariables>
