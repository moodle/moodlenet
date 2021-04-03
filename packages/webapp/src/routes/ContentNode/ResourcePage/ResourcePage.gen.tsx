import * as Apollo from '@apollo/client'
import { gql } from '@apollo/client'
import * as Types from '../../../graphql/pub.graphql.link'

export type ResourcePageNodeQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']
}>

export type ResourcePageNodeQuery = { __typename: 'Query' } & {
  node?: Types.Maybe<
    | { __typename: 'Collection' }
    | { __typename: 'Profile' }
    | ({ __typename: 'Resource' } & Pick<Types.Resource, '_id' | 'name' | 'icon'> & {
          myLike: { __typename: 'RelPage' } & {
            edges: Array<
              { __typename: 'RelPageEdge' } & {
                edge:
                  | ({ __typename: 'AppliesTo' } & Pick<Types.AppliesTo, '_id'>)
                  | ({ __typename: 'Contains' } & Pick<Types.Contains, '_id'>)
                  | ({ __typename: 'Created' } & Pick<Types.Created, '_id'>)
                  | ({ __typename: 'Follows' } & Pick<Types.Follows, '_id'>)
                  | ({ __typename: 'Likes' } & Pick<Types.Likes, '_id'>)
              }
            >
          }
          _meta: { __typename: 'NodeMeta' } & Pick<Types.NodeMeta, 'created'> & {
              creator: { __typename: 'Profile' } & Pick<Types.Profile, '_id' | 'name' | 'icon'>
              relCount?: Types.Maybe<
                { __typename: 'RelCountMap' } & {
                  Likes?: Types.Maybe<
                    { __typename: 'RelCount' } & {
                      from?: Types.Maybe<{ __typename: 'RelCountTargetMap' } & Pick<Types.RelCountTargetMap, 'Profile'>>
                    }
                  >
                  Contains?: Types.Maybe<
                    { __typename: 'RelCount' } & {
                      to?: Types.Maybe<{ __typename: 'RelCountTargetMap' } & Pick<Types.RelCountTargetMap, 'Resource'>>
                    }
                  >
                }
              >
            }
        })
    | { __typename: 'Subject' }
  >
}

export type ResourcePageResourcesQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']
}>

export type ResourcePageResourcesQuery = { __typename: 'Query' } & {
  node?: Types.Maybe<
    | ({ __typename: 'Collection' } & Pick<Types.Collection, '_id'> & {
          resourceList: { __typename: 'RelPage' } & {
            edges: Array<
              { __typename: 'RelPageEdge' } & {
                node:
                  | { __typename: 'Collection' }
                  | { __typename: 'Profile' }
                  | ({ __typename: 'Resource' } & Pick<Types.Resource, '_id' | 'name' | 'icon'> & {
                        resources: { __typename: 'RelPage' } & {
                          edges: Array<
                            { __typename: 'RelPageEdge' } & {
                              node:
                                | { __typename: 'Collection' }
                                | { __typename: 'Profile' }
                                | ({ __typename: 'Resource' } & Pick<Types.Resource, '_id' | 'name'>)
                                | { __typename: 'Subject' }
                            }
                          >
                        }
                      })
                  | { __typename: 'Subject' }
              }
            >
          }
        })
    | ({ __typename: 'Profile' } & Pick<Types.Profile, '_id'> & {
          resourceList: { __typename: 'RelPage' } & {
            edges: Array<
              { __typename: 'RelPageEdge' } & {
                node:
                  | { __typename: 'Collection' }
                  | { __typename: 'Profile' }
                  | ({ __typename: 'Resource' } & Pick<Types.Resource, '_id' | 'name' | 'icon'> & {
                        resources: { __typename: 'RelPage' } & {
                          edges: Array<
                            { __typename: 'RelPageEdge' } & {
                              node:
                                | { __typename: 'Collection' }
                                | { __typename: 'Profile' }
                                | ({ __typename: 'Resource' } & Pick<Types.Resource, '_id' | 'name'>)
                                | { __typename: 'Subject' }
                            }
                          >
                        }
                      })
                  | { __typename: 'Subject' }
              }
            >
          }
        })
    | ({ __typename: 'Resource' } & Pick<Types.Resource, '_id'> & {
          resourceList: { __typename: 'RelPage' } & {
            edges: Array<
              { __typename: 'RelPageEdge' } & {
                node:
                  | { __typename: 'Collection' }
                  | { __typename: 'Profile' }
                  | ({ __typename: 'Resource' } & Pick<Types.Resource, '_id' | 'name' | 'icon'> & {
                        resources: { __typename: 'RelPage' } & {
                          edges: Array<
                            { __typename: 'RelPageEdge' } & {
                              node:
                                | { __typename: 'Collection' }
                                | { __typename: 'Profile' }
                                | ({ __typename: 'Resource' } & Pick<Types.Resource, '_id' | 'name'>)
                                | { __typename: 'Subject' }
                            }
                          >
                        }
                      })
                  | { __typename: 'Subject' }
              }
            >
          }
        })
    | ({ __typename: 'Subject' } & Pick<Types.Subject, '_id'> & {
          resourceList: { __typename: 'RelPage' } & {
            edges: Array<
              { __typename: 'RelPageEdge' } & {
                node:
                  | { __typename: 'Collection' }
                  | { __typename: 'Profile' }
                  | ({ __typename: 'Resource' } & Pick<Types.Resource, '_id' | 'name' | 'icon'> & {
                        resources: { __typename: 'RelPage' } & {
                          edges: Array<
                            { __typename: 'RelPageEdge' } & {
                              node:
                                | { __typename: 'Collection' }
                                | { __typename: 'Profile' }
                                | ({ __typename: 'Resource' } & Pick<Types.Resource, '_id' | 'name'>)
                                | { __typename: 'Subject' }
                            }
                          >
                        }
                      })
                  | { __typename: 'Subject' }
              }
            >
          }
        })
  >
}

export type ResourcePageFollowMutationVariables = Types.Exact<{
  currentProfileId: Types.Scalars['ID']
  resourceId: Types.Scalars['ID']
}>

export type ResourcePageFollowMutation = { __typename: 'Mutation' } & {
  createEdge:
    | ({ __typename: 'CreateEdgeMutationSuccess' } & BasicCreateEdgeMutationPayload_CreateEdgeMutationSuccess_Fragment)
    | ({ __typename: 'CreateEdgeMutationError' } & BasicCreateEdgeMutationPayload_CreateEdgeMutationError_Fragment)
}

export type BasicCreateEdgeMutationPayload_CreateEdgeMutationSuccess_Fragment = {
  __typename: 'CreateEdgeMutationSuccess'
} & {
  edge?: Types.Maybe<
    | ({ __typename: 'AppliesTo' } & Pick<Types.AppliesTo, '_id'>)
    | ({ __typename: 'Contains' } & Pick<Types.Contains, '_id'>)
    | ({ __typename: 'Created' } & Pick<Types.Created, '_id'>)
    | ({ __typename: 'Follows' } & Pick<Types.Follows, '_id'>)
    | ({ __typename: 'Likes' } & Pick<Types.Likes, '_id'>)
  >
}

export type BasicCreateEdgeMutationPayload_CreateEdgeMutationError_Fragment = {
  __typename: 'CreateEdgeMutationError'
} & Pick<Types.CreateEdgeMutationError, 'type' | 'details'>

export type BasicCreateEdgeMutationPayloadFragment =
  | BasicCreateEdgeMutationPayload_CreateEdgeMutationSuccess_Fragment
  | BasicCreateEdgeMutationPayload_CreateEdgeMutationError_Fragment

export type ResourcePageUnfollowMutationVariables = Types.Exact<{
  edgeId: Types.Scalars['ID']
}>

export type ResourcePageUnfollowMutation = { __typename: 'Mutation' } & {
  deleteEdge:
    | ({ __typename: 'DeleteEdgeMutationSuccess' } & BasicDeleteEdgeMutationPayload_DeleteEdgeMutationSuccess_Fragment)
    | ({ __typename: 'DeleteEdgeMutationError' } & BasicDeleteEdgeMutationPayload_DeleteEdgeMutationError_Fragment)
}

export type BasicDeleteEdgeMutationPayload_DeleteEdgeMutationSuccess_Fragment = {
  __typename: 'DeleteEdgeMutationSuccess'
} & Pick<Types.DeleteEdgeMutationSuccess, 'edgeId'>

export type BasicDeleteEdgeMutationPayload_DeleteEdgeMutationError_Fragment = {
  __typename: 'DeleteEdgeMutationError'
} & Pick<Types.DeleteEdgeMutationError, 'type' | 'details'>

export type BasicDeleteEdgeMutationPayloadFragment =
  | BasicDeleteEdgeMutationPayload_DeleteEdgeMutationSuccess_Fragment
  | BasicDeleteEdgeMutationPayload_DeleteEdgeMutationError_Fragment

export const BasicCreateEdgeMutationPayloadFragmentDoc = gql`
  fragment BasicCreateEdgeMutationPayload on CreateEdgeMutationPayload {
    ... on CreateEdgeMutationSuccess {
      edge {
        ... on IEdge {
          _id
        }
      }
    }
    ... on CreateEdgeMutationError {
      type
      details
    }
  }
`
export const BasicDeleteEdgeMutationPayloadFragmentDoc = gql`
  fragment BasicDeleteEdgeMutationPayload on DeleteEdgeMutationPayload {
    ... on DeleteEdgeMutationSuccess {
      edgeId
    }
    ... on DeleteEdgeMutationError {
      type
      details
    }
  }
`
export const ResourcePageNodeDocument = gql`
  query ResourcePageNode($id: ID!) {
    node(_id: $id) {
      ... on Resource {
        _id
        name
        icon
        myLike: _rel(edge: { type: Likes, node: Profile, inverse: true, targetMe: true }, page: { first: 1 }) {
          edges {
            edge {
              ... on IEdge {
                _id
              }
            }
          }
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
`

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
export function useResourcePageNodeQuery(
  baseOptions: Apollo.QueryHookOptions<ResourcePageNodeQuery, ResourcePageNodeQueryVariables>,
) {
  return Apollo.useQuery<ResourcePageNodeQuery, ResourcePageNodeQueryVariables>(ResourcePageNodeDocument, baseOptions)
}
export function useResourcePageNodeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ResourcePageNodeQuery, ResourcePageNodeQueryVariables>,
) {
  return Apollo.useLazyQuery<ResourcePageNodeQuery, ResourcePageNodeQueryVariables>(
    ResourcePageNodeDocument,
    baseOptions,
  )
}
export type ResourcePageNodeQueryHookResult = ReturnType<typeof useResourcePageNodeQuery>
export type ResourcePageNodeLazyQueryHookResult = ReturnType<typeof useResourcePageNodeLazyQuery>
export type ResourcePageNodeQueryResult = Apollo.QueryResult<ResourcePageNodeQuery, ResourcePageNodeQueryVariables>
export const ResourcePageResourcesDocument = gql`
  query ResourcePageResources($id: ID!) {
    node(_id: $id) {
      ... on INode {
        _id
        resourceList: _rel(edge: { type: Contains, node: Resource }, page: { first: 10 }) {
          edges {
            node {
              ... on Resource {
                _id
                name
                icon
                resources: _rel(edge: { type: Contains, node: Resource, inverse: true }, page: { first: 2 }) {
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
`

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
export function useResourcePageResourcesQuery(
  baseOptions: Apollo.QueryHookOptions<ResourcePageResourcesQuery, ResourcePageResourcesQueryVariables>,
) {
  return Apollo.useQuery<ResourcePageResourcesQuery, ResourcePageResourcesQueryVariables>(
    ResourcePageResourcesDocument,
    baseOptions,
  )
}
export function useResourcePageResourcesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ResourcePageResourcesQuery, ResourcePageResourcesQueryVariables>,
) {
  return Apollo.useLazyQuery<ResourcePageResourcesQuery, ResourcePageResourcesQueryVariables>(
    ResourcePageResourcesDocument,
    baseOptions,
  )
}
export type ResourcePageResourcesQueryHookResult = ReturnType<typeof useResourcePageResourcesQuery>
export type ResourcePageResourcesLazyQueryHookResult = ReturnType<typeof useResourcePageResourcesLazyQuery>
export type ResourcePageResourcesQueryResult = Apollo.QueryResult<
  ResourcePageResourcesQuery,
  ResourcePageResourcesQueryVariables
>
export const ResourcePageFollowDocument = gql`
  mutation ResourcePageFollow($currentProfileId: ID!, $resourceId: ID!) {
    createEdge(input: { edgeType: Follows, from: $currentProfileId, to: $resourceId, Follows: {} }) {
      ...BasicCreateEdgeMutationPayload
    }
  }
  ${BasicCreateEdgeMutationPayloadFragmentDoc}
`
export type ResourcePageFollowMutationFn = Apollo.MutationFunction<
  ResourcePageFollowMutation,
  ResourcePageFollowMutationVariables
>

/**
 * __useResourcePageFollowMutation__
 *
 * To run a mutation, you first call `useResourcePageFollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResourcePageFollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resourcePageFollowMutation, { data, loading, error }] = useResourcePageFollowMutation({
 *   variables: {
 *      currentProfileId: // value for 'currentProfileId'
 *      resourceId: // value for 'resourceId'
 *   },
 * });
 */
export function useResourcePageFollowMutation(
  baseOptions?: Apollo.MutationHookOptions<ResourcePageFollowMutation, ResourcePageFollowMutationVariables>,
) {
  return Apollo.useMutation<ResourcePageFollowMutation, ResourcePageFollowMutationVariables>(
    ResourcePageFollowDocument,
    baseOptions,
  )
}
export type ResourcePageFollowMutationHookResult = ReturnType<typeof useResourcePageFollowMutation>
export type ResourcePageFollowMutationResult = Apollo.MutationResult<ResourcePageFollowMutation>
export type ResourcePageFollowMutationOptions = Apollo.BaseMutationOptions<
  ResourcePageFollowMutation,
  ResourcePageFollowMutationVariables
>
export const ResourcePageUnfollowDocument = gql`
  mutation ResourcePageUnfollow($edgeId: ID!) {
    deleteEdge(input: { _id: $edgeId, edgeType: Follows }) {
      ...BasicDeleteEdgeMutationPayload
    }
  }
  ${BasicDeleteEdgeMutationPayloadFragmentDoc}
`
export type ResourcePageUnfollowMutationFn = Apollo.MutationFunction<
  ResourcePageUnfollowMutation,
  ResourcePageUnfollowMutationVariables
>

/**
 * __useResourcePageUnfollowMutation__
 *
 * To run a mutation, you first call `useResourcePageUnfollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResourcePageUnfollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resourcePageUnfollowMutation, { data, loading, error }] = useResourcePageUnfollowMutation({
 *   variables: {
 *      edgeId: // value for 'edgeId'
 *   },
 * });
 */
export function useResourcePageUnfollowMutation(
  baseOptions?: Apollo.MutationHookOptions<ResourcePageUnfollowMutation, ResourcePageUnfollowMutationVariables>,
) {
  return Apollo.useMutation<ResourcePageUnfollowMutation, ResourcePageUnfollowMutationVariables>(
    ResourcePageUnfollowDocument,
    baseOptions,
  )
}
export type ResourcePageUnfollowMutationHookResult = ReturnType<typeof useResourcePageUnfollowMutation>
export type ResourcePageUnfollowMutationResult = Apollo.MutationResult<ResourcePageUnfollowMutation>
export type ResourcePageUnfollowMutationOptions = Apollo.BaseMutationOptions<
  ResourcePageUnfollowMutation,
  ResourcePageUnfollowMutationVariables
>
