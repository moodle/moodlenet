import * as Apollo from '@apollo/client'
import { gql } from '@apollo/client'
import * as Types from '../../../../../graphql/pub.graphql.link'

const defaultOptions = {}
export type ResourceCardQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']
}>

export type ResourceCardQuery = { __typename: 'Query' } & {
  node?: Types.Maybe<
    | ({ __typename: 'Collection' } & Pick<Types.Collection, 'name' | 'icon' | 'id'> & {
          inCollections: { __typename: 'RelPage' } & {
            edges: Array<
              { __typename: 'RelPageEdge' } & {
                node:
                  | ({ __typename: 'Collection' } & Pick<Types.Collection, 'id' | 'name'>)
                  | { __typename: 'Organization' }
                  | { __typename: 'Profile' }
                  | { __typename: 'Resource' }
                  | { __typename: 'Iscedfield' }
              }
            >
          }
        })
    | ({ __typename: 'Organization' } & Pick<Types.Organization, 'name' | 'icon' | 'id'> & {
          inCollections: { __typename: 'RelPage' } & {
            edges: Array<
              { __typename: 'RelPageEdge' } & {
                node:
                  | ({ __typename: 'Collection' } & Pick<Types.Collection, 'id' | 'name'>)
                  | { __typename: 'Organization' }
                  | { __typename: 'Profile' }
                  | { __typename: 'Resource' }
                  | { __typename: 'Iscedfield' }
              }
            >
          }
        })
    | ({ __typename: 'Profile' } & Pick<Types.Profile, 'name' | 'icon' | 'id'> & {
          inCollections: { __typename: 'RelPage' } & {
            edges: Array<
              { __typename: 'RelPageEdge' } & {
                node:
                  | ({ __typename: 'Collection' } & Pick<Types.Collection, 'id' | 'name'>)
                  | { __typename: 'Organization' }
                  | { __typename: 'Profile' }
                  | { __typename: 'Resource' }
                  | { __typename: 'Iscedfield' }
              }
            >
          }
        })
    | ({ __typename: 'Resource' } & Pick<Types.Resource, 'name' | 'icon' | 'id'> & {
          inCollections: { __typename: 'RelPage' } & {
            edges: Array<
              { __typename: 'RelPageEdge' } & {
                node:
                  | ({ __typename: 'Collection' } & Pick<Types.Collection, 'id' | 'name'>)
                  | { __typename: 'Organization' }
                  | { __typename: 'Profile' }
                  | { __typename: 'Resource' }
                  | { __typename: 'Iscedfield' }
              }
            >
          }
        })
    | ({ __typename: 'Iscedfield' } & Pick<Types.Iscedfield, 'name' | 'icon' | 'id'> & {
          inCollections: { __typename: 'RelPage' } & {
            edges: Array<
              { __typename: 'RelPageEdge' } & {
                node:
                  | ({ __typename: 'Collection' } & Pick<Types.Collection, 'id' | 'name'>)
                  | { __typename: 'Organization' }
                  | { __typename: 'Profile' }
                  | { __typename: 'Resource' }
                  | { __typename: 'Iscedfield' }
              }
            >
          }
        })
  >
}

export const ResourceCardDocument = gql`
  query ResourceCard($id: ID!) {
    node(id: $id) {
      ... on IContentNode {
        name
        icon
      }
      ... on INode {
        id
        inCollections: _rel(edge: { type: Contains, node: Collection, inverse: true }, page: { first: 3 }) {
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
`

/**
 * __useResourceCardQuery__
 *
 * To run a query within a React component, call `useResourceCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useResourceCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useResourceCardQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useResourceCardQuery(
  baseOptions: Apollo.QueryHookOptions<ResourceCardQuery, ResourceCardQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ResourceCardQuery, ResourceCardQueryVariables>(ResourceCardDocument, options)
}
export function useResourceCardLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ResourceCardQuery, ResourceCardQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<ResourceCardQuery, ResourceCardQueryVariables>(ResourceCardDocument, options)
}
export type ResourceCardQueryHookResult = ReturnType<typeof useResourceCardQuery>
export type ResourceCardLazyQueryHookResult = ReturnType<typeof useResourceCardLazyQuery>
export type ResourceCardQueryResult = Apollo.QueryResult<ResourceCardQuery, ResourceCardQueryVariables>
