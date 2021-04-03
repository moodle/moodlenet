import * as Apollo from '@apollo/client'
import { gql } from '@apollo/client'
import * as Types from '../../../graphql/pub.graphql.link'

export type SubjectPageNodeQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']
}>

export type SubjectPageNodeQuery = { __typename: 'Query' } & {
  node?: Types.Maybe<
    | { __typename: 'Collection' }
    | { __typename: 'Profile' }
    | { __typename: 'Resource' }
    | ({ __typename: 'Subject' } & Pick<Types.Subject, '_id' | 'name'> & {
          myFollow: { __typename: 'RelPage' } & {
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
          _meta: { __typename: 'NodeMeta' } & {
            relCount?: Types.Maybe<
              { __typename: 'RelCountMap' } & {
                Follows?: Types.Maybe<
                  { __typename: 'RelCount' } & {
                    from?: Types.Maybe<{ __typename: 'RelCountTargetMap' } & Pick<Types.RelCountTargetMap, 'Profile'>>
                  }
                >
                AppliesTo?: Types.Maybe<
                  { __typename: 'RelCount' } & {
                    to?: Types.Maybe<
                      { __typename: 'RelCountTargetMap' } & Pick<Types.RelCountTargetMap, 'Collection' | 'Resource'>
                    >
                  }
                >
              }
            >
          }
        })
  >
}

export type SubjectPageCollectionsQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']
}>

export type SubjectPageCollectionsQuery = { __typename: 'Query' } & {
  node?: Types.Maybe<
    | ({ __typename: 'Collection' } & Pick<Types.Collection, '_id'> & {
          collectionList: { __typename: 'RelPage' } & {
            edges: Array<
              { __typename: 'RelPageEdge' } & {
                node:
                  | ({ __typename: 'Collection' } & Pick<Types.Collection, '_id' | 'name' | 'icon'> & {
                        _meta: { __typename: 'NodeMeta' } & {
                          relCount?: Types.Maybe<
                            { __typename: 'RelCountMap' } & {
                              Follows?: Types.Maybe<
                                { __typename: 'RelCount' } & {
                                  from?: Types.Maybe<
                                    { __typename: 'RelCountTargetMap' } & Pick<Types.RelCountTargetMap, 'Profile'>
                                  >
                                }
                              >
                              Contains?: Types.Maybe<
                                { __typename: 'RelCount' } & {
                                  to?: Types.Maybe<
                                    { __typename: 'RelCountTargetMap' } & Pick<Types.RelCountTargetMap, 'Resource'>
                                  >
                                }
                              >
                            }
                          >
                        }
                      })
                  | { __typename: 'Profile' }
                  | { __typename: 'Resource' }
                  | { __typename: 'Subject' }
              }
            >
          }
        })
    | ({ __typename: 'Profile' } & Pick<Types.Profile, '_id'> & {
          collectionList: { __typename: 'RelPage' } & {
            edges: Array<
              { __typename: 'RelPageEdge' } & {
                node:
                  | ({ __typename: 'Collection' } & Pick<Types.Collection, '_id' | 'name' | 'icon'> & {
                        _meta: { __typename: 'NodeMeta' } & {
                          relCount?: Types.Maybe<
                            { __typename: 'RelCountMap' } & {
                              Follows?: Types.Maybe<
                                { __typename: 'RelCount' } & {
                                  from?: Types.Maybe<
                                    { __typename: 'RelCountTargetMap' } & Pick<Types.RelCountTargetMap, 'Profile'>
                                  >
                                }
                              >
                              Contains?: Types.Maybe<
                                { __typename: 'RelCount' } & {
                                  to?: Types.Maybe<
                                    { __typename: 'RelCountTargetMap' } & Pick<Types.RelCountTargetMap, 'Resource'>
                                  >
                                }
                              >
                            }
                          >
                        }
                      })
                  | { __typename: 'Profile' }
                  | { __typename: 'Resource' }
                  | { __typename: 'Subject' }
              }
            >
          }
        })
    | ({ __typename: 'Resource' } & Pick<Types.Resource, '_id'> & {
          collectionList: { __typename: 'RelPage' } & {
            edges: Array<
              { __typename: 'RelPageEdge' } & {
                node:
                  | ({ __typename: 'Collection' } & Pick<Types.Collection, '_id' | 'name' | 'icon'> & {
                        _meta: { __typename: 'NodeMeta' } & {
                          relCount?: Types.Maybe<
                            { __typename: 'RelCountMap' } & {
                              Follows?: Types.Maybe<
                                { __typename: 'RelCount' } & {
                                  from?: Types.Maybe<
                                    { __typename: 'RelCountTargetMap' } & Pick<Types.RelCountTargetMap, 'Profile'>
                                  >
                                }
                              >
                              Contains?: Types.Maybe<
                                { __typename: 'RelCount' } & {
                                  to?: Types.Maybe<
                                    { __typename: 'RelCountTargetMap' } & Pick<Types.RelCountTargetMap, 'Resource'>
                                  >
                                }
                              >
                            }
                          >
                        }
                      })
                  | { __typename: 'Profile' }
                  | { __typename: 'Resource' }
                  | { __typename: 'Subject' }
              }
            >
          }
        })
    | ({ __typename: 'Subject' } & Pick<Types.Subject, '_id'> & {
          collectionList: { __typename: 'RelPage' } & {
            edges: Array<
              { __typename: 'RelPageEdge' } & {
                node:
                  | ({ __typename: 'Collection' } & Pick<Types.Collection, '_id' | 'name' | 'icon'> & {
                        _meta: { __typename: 'NodeMeta' } & {
                          relCount?: Types.Maybe<
                            { __typename: 'RelCountMap' } & {
                              Follows?: Types.Maybe<
                                { __typename: 'RelCount' } & {
                                  from?: Types.Maybe<
                                    { __typename: 'RelCountTargetMap' } & Pick<Types.RelCountTargetMap, 'Profile'>
                                  >
                                }
                              >
                              Contains?: Types.Maybe<
                                { __typename: 'RelCount' } & {
                                  to?: Types.Maybe<
                                    { __typename: 'RelCountTargetMap' } & Pick<Types.RelCountTargetMap, 'Resource'>
                                  >
                                }
                              >
                            }
                          >
                        }
                      })
                  | { __typename: 'Profile' }
                  | { __typename: 'Resource' }
                  | { __typename: 'Subject' }
              }
            >
          }
        })
  >
}

export type SubjectPageResourcesQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']
}>

export type SubjectPageResourcesQuery = { __typename: 'Query' } & {
  node?: Types.Maybe<
    | ({ __typename: 'Collection' } & Pick<Types.Collection, '_id'> & {
          resourceList: { __typename: 'RelPage' } & {
            edges: Array<
              { __typename: 'RelPageEdge' } & {
                node:
                  | { __typename: 'Collection' }
                  | { __typename: 'Profile' }
                  | ({ __typename: 'Resource' } & Pick<Types.Resource, '_id' | 'name' | 'icon'> & {
                        collections: { __typename: 'RelPage' } & {
                          edges: Array<
                            { __typename: 'RelPageEdge' } & {
                              node:
                                | ({ __typename: 'Collection' } & Pick<Types.Collection, '_id' | 'name'>)
                                | { __typename: 'Profile' }
                                | { __typename: 'Resource' }
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
                        collections: { __typename: 'RelPage' } & {
                          edges: Array<
                            { __typename: 'RelPageEdge' } & {
                              node:
                                | ({ __typename: 'Collection' } & Pick<Types.Collection, '_id' | 'name'>)
                                | { __typename: 'Profile' }
                                | { __typename: 'Resource' }
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
                        collections: { __typename: 'RelPage' } & {
                          edges: Array<
                            { __typename: 'RelPageEdge' } & {
                              node:
                                | ({ __typename: 'Collection' } & Pick<Types.Collection, '_id' | 'name'>)
                                | { __typename: 'Profile' }
                                | { __typename: 'Resource' }
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
                        collections: { __typename: 'RelPage' } & {
                          edges: Array<
                            { __typename: 'RelPageEdge' } & {
                              node:
                                | ({ __typename: 'Collection' } & Pick<Types.Collection, '_id' | 'name'>)
                                | { __typename: 'Profile' }
                                | { __typename: 'Resource' }
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

export type SubjectPageFollowMutationVariables = Types.Exact<{
  currentProfileId: Types.Scalars['ID']
  subjectId: Types.Scalars['ID']
}>

export type SubjectPageFollowMutation = { __typename: 'Mutation' } & {
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

export type SubjectPageUnfollowMutationVariables = Types.Exact<{
  edgeId: Types.Scalars['ID']
}>

export type SubjectPageUnfollowMutation = { __typename: 'Mutation' } & {
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
export const SubjectPageNodeDocument = gql`
  query SubjectPageNode($id: ID!) {
    node(_id: $id) {
      ... on Subject {
        _id
        name
        myFollow: _rel(edge: { type: Follows, node: Profile, inverse: true, targetMe: true }, page: { first: 1 }) {
          edges {
            edge {
              ... on IEdge {
                _id
              }
            }
          }
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
`

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
export function useSubjectPageNodeQuery(
  baseOptions: Apollo.QueryHookOptions<SubjectPageNodeQuery, SubjectPageNodeQueryVariables>,
) {
  return Apollo.useQuery<SubjectPageNodeQuery, SubjectPageNodeQueryVariables>(SubjectPageNodeDocument, baseOptions)
}
export function useSubjectPageNodeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SubjectPageNodeQuery, SubjectPageNodeQueryVariables>,
) {
  return Apollo.useLazyQuery<SubjectPageNodeQuery, SubjectPageNodeQueryVariables>(SubjectPageNodeDocument, baseOptions)
}
export type SubjectPageNodeQueryHookResult = ReturnType<typeof useSubjectPageNodeQuery>
export type SubjectPageNodeLazyQueryHookResult = ReturnType<typeof useSubjectPageNodeLazyQuery>
export type SubjectPageNodeQueryResult = Apollo.QueryResult<SubjectPageNodeQuery, SubjectPageNodeQueryVariables>
export const SubjectPageCollectionsDocument = gql`
  query SubjectPageCollections($id: ID!) {
    node(_id: $id) {
      ... on INode {
        _id
        collectionList: _rel(edge: { type: AppliesTo, node: Collection }, page: { first: 10 }) {
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
`

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
export function useSubjectPageCollectionsQuery(
  baseOptions: Apollo.QueryHookOptions<SubjectPageCollectionsQuery, SubjectPageCollectionsQueryVariables>,
) {
  return Apollo.useQuery<SubjectPageCollectionsQuery, SubjectPageCollectionsQueryVariables>(
    SubjectPageCollectionsDocument,
    baseOptions,
  )
}
export function useSubjectPageCollectionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SubjectPageCollectionsQuery, SubjectPageCollectionsQueryVariables>,
) {
  return Apollo.useLazyQuery<SubjectPageCollectionsQuery, SubjectPageCollectionsQueryVariables>(
    SubjectPageCollectionsDocument,
    baseOptions,
  )
}
export type SubjectPageCollectionsQueryHookResult = ReturnType<typeof useSubjectPageCollectionsQuery>
export type SubjectPageCollectionsLazyQueryHookResult = ReturnType<typeof useSubjectPageCollectionsLazyQuery>
export type SubjectPageCollectionsQueryResult = Apollo.QueryResult<
  SubjectPageCollectionsQuery,
  SubjectPageCollectionsQueryVariables
>
export const SubjectPageResourcesDocument = gql`
  query SubjectPageResources($id: ID!) {
    node(_id: $id) {
      ... on INode {
        _id
        resourceList: _rel(edge: { type: AppliesTo, node: Resource }, page: { first: 10 }) {
          edges {
            node {
              ... on Resource {
                _id
                name
                icon
                collections: _rel(edge: { type: Contains, node: Collection, inverse: true }, page: { first: 2 }) {
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
`

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
export function useSubjectPageResourcesQuery(
  baseOptions: Apollo.QueryHookOptions<SubjectPageResourcesQuery, SubjectPageResourcesQueryVariables>,
) {
  return Apollo.useQuery<SubjectPageResourcesQuery, SubjectPageResourcesQueryVariables>(
    SubjectPageResourcesDocument,
    baseOptions,
  )
}
export function useSubjectPageResourcesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SubjectPageResourcesQuery, SubjectPageResourcesQueryVariables>,
) {
  return Apollo.useLazyQuery<SubjectPageResourcesQuery, SubjectPageResourcesQueryVariables>(
    SubjectPageResourcesDocument,
    baseOptions,
  )
}
export type SubjectPageResourcesQueryHookResult = ReturnType<typeof useSubjectPageResourcesQuery>
export type SubjectPageResourcesLazyQueryHookResult = ReturnType<typeof useSubjectPageResourcesLazyQuery>
export type SubjectPageResourcesQueryResult = Apollo.QueryResult<
  SubjectPageResourcesQuery,
  SubjectPageResourcesQueryVariables
>
export const SubjectPageFollowDocument = gql`
  mutation SubjectPageFollow($currentProfileId: ID!, $subjectId: ID!) {
    createEdge(input: { edgeType: Follows, from: $currentProfileId, to: $subjectId, Follows: {} }) {
      ...BasicCreateEdgeMutationPayload
    }
  }
  ${BasicCreateEdgeMutationPayloadFragmentDoc}
`
export type SubjectPageFollowMutationFn = Apollo.MutationFunction<
  SubjectPageFollowMutation,
  SubjectPageFollowMutationVariables
>

/**
 * __useSubjectPageFollowMutation__
 *
 * To run a mutation, you first call `useSubjectPageFollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubjectPageFollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [subjectPageFollowMutation, { data, loading, error }] = useSubjectPageFollowMutation({
 *   variables: {
 *      currentProfileId: // value for 'currentProfileId'
 *      subjectId: // value for 'subjectId'
 *   },
 * });
 */
export function useSubjectPageFollowMutation(
  baseOptions?: Apollo.MutationHookOptions<SubjectPageFollowMutation, SubjectPageFollowMutationVariables>,
) {
  return Apollo.useMutation<SubjectPageFollowMutation, SubjectPageFollowMutationVariables>(
    SubjectPageFollowDocument,
    baseOptions,
  )
}
export type SubjectPageFollowMutationHookResult = ReturnType<typeof useSubjectPageFollowMutation>
export type SubjectPageFollowMutationResult = Apollo.MutationResult<SubjectPageFollowMutation>
export type SubjectPageFollowMutationOptions = Apollo.BaseMutationOptions<
  SubjectPageFollowMutation,
  SubjectPageFollowMutationVariables
>
export const SubjectPageUnfollowDocument = gql`
  mutation SubjectPageUnfollow($edgeId: ID!) {
    deleteEdge(input: { _id: $edgeId, edgeType: Follows }) {
      ...BasicDeleteEdgeMutationPayload
    }
  }
  ${BasicDeleteEdgeMutationPayloadFragmentDoc}
`
export type SubjectPageUnfollowMutationFn = Apollo.MutationFunction<
  SubjectPageUnfollowMutation,
  SubjectPageUnfollowMutationVariables
>

/**
 * __useSubjectPageUnfollowMutation__
 *
 * To run a mutation, you first call `useSubjectPageUnfollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubjectPageUnfollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [subjectPageUnfollowMutation, { data, loading, error }] = useSubjectPageUnfollowMutation({
 *   variables: {
 *      edgeId: // value for 'edgeId'
 *   },
 * });
 */
export function useSubjectPageUnfollowMutation(
  baseOptions?: Apollo.MutationHookOptions<SubjectPageUnfollowMutation, SubjectPageUnfollowMutationVariables>,
) {
  return Apollo.useMutation<SubjectPageUnfollowMutation, SubjectPageUnfollowMutationVariables>(
    SubjectPageUnfollowDocument,
    baseOptions,
  )
}
export type SubjectPageUnfollowMutationHookResult = ReturnType<typeof useSubjectPageUnfollowMutation>
export type SubjectPageUnfollowMutationResult = Apollo.MutationResult<SubjectPageUnfollowMutation>
export type SubjectPageUnfollowMutationOptions = Apollo.BaseMutationOptions<
  SubjectPageUnfollowMutation,
  SubjectPageUnfollowMutationVariables
>
