import * as Types from '../../../graphql/pub.graphql.link';

import { ShallowProfileFragment } from '../../../graphql/fragment/nodes.gen';
import { gql } from '@apollo/client';
import { ShallowProfileFragmentDoc } from '../../../graphql/fragment/nodes.gen';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type GetCurrentSessionQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetCurrentSessionQuery = (
  { __typename: 'Query' }
  & { getSession?: Types.Maybe<(
    { __typename: 'UserSession' }
    & UserSessionFragFragment
  )> }
);

export type GetCurrentProfileQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetCurrentProfileQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<{ __typename: 'Collection' } | (
    { __typename: 'Profile' }
    & CurrentProfileInfoFragment
  ) | { __typename: 'Resource' } | { __typename: 'SubjectField' }> }
);

export type LoginMutationVariables = Types.Exact<{
  username: Types.Scalars['String'];
  password: Types.Scalars['String'];
}>;


export type LoginMutation = (
  { __typename: 'Mutation' }
  & { createSession: (
    { __typename: 'CreateSession' }
    & Pick<Types.CreateSession, 'jwt' | 'message'>
  ) }
);

export type ActivateNewUserMutationVariables = Types.Exact<{
  token: Types.Scalars['String'];
  username: Types.Scalars['String'];
  password: Types.Scalars['String'];
}>;


export type ActivateNewUserMutation = (
  { __typename: 'Mutation' }
  & { activateUser: (
    { __typename: 'CreateSession' }
    & Pick<Types.CreateSession, 'jwt' | 'message'>
  ) }
);

export type UserSessionFragFragment = (
  { __typename: 'UserSession' }
  & Pick<Types.UserSession, 'username'>
);

export type CurrentProfileInfoFragment = (
  { __typename: 'Profile' }
  & { myOwnCollections: (
    { __typename: 'RelPage' }
    & { edges: Array<(
      { __typename: 'RelPageEdge' }
      & { node: (
        { __typename: 'Collection' }
        & Pick<Types.Collection, 'id' | 'name' | 'icon'>
      ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'SubjectField' } }
    )> }
  ) }
  & ShallowProfileFragment
);

export const UserSessionFragFragmentDoc = gql`
    fragment UserSessionFrag on UserSession {
  username
}
    `;
export const CurrentProfileInfoFragmentDoc = gql`
    fragment CurrentProfileInfo on Profile {
  ...ShallowProfile
  myOwnCollections: _rel(
    edge: {type: Created, node: Collection}
    page: {first: 100}
  ) {
    edges {
      node {
        ... on Collection {
          id
          name
          icon
        }
      }
    }
  }
}
    ${ShallowProfileFragmentDoc}`;
export const GetCurrentSessionDocument = gql`
    query getCurrentSession {
  getSession {
    ...UserSessionFrag
  }
}
    ${UserSessionFragFragmentDoc}`;

/**
 * __useGetCurrentSessionQuery__
 *
 * To run a query within a React component, call `useGetCurrentSessionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentSessionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentSessionQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentSessionQuery(baseOptions?: Apollo.QueryHookOptions<GetCurrentSessionQuery, GetCurrentSessionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentSessionQuery, GetCurrentSessionQueryVariables>(GetCurrentSessionDocument, options);
      }
export function useGetCurrentSessionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentSessionQuery, GetCurrentSessionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentSessionQuery, GetCurrentSessionQueryVariables>(GetCurrentSessionDocument, options);
        }
export type GetCurrentSessionQueryHookResult = ReturnType<typeof useGetCurrentSessionQuery>;
export type GetCurrentSessionLazyQueryHookResult = ReturnType<typeof useGetCurrentSessionLazyQuery>;
export type GetCurrentSessionQueryResult = Apollo.QueryResult<GetCurrentSessionQuery, GetCurrentSessionQueryVariables>;
export const GetCurrentProfileDocument = gql`
    query getCurrentProfile($id: ID!) {
  node(id: $id) {
    ... on Profile {
      ...CurrentProfileInfo
    }
  }
}
    ${CurrentProfileInfoFragmentDoc}`;

/**
 * __useGetCurrentProfileQuery__
 *
 * To run a query within a React component, call `useGetCurrentProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentProfileQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCurrentProfileQuery(baseOptions: Apollo.QueryHookOptions<GetCurrentProfileQuery, GetCurrentProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentProfileQuery, GetCurrentProfileQueryVariables>(GetCurrentProfileDocument, options);
      }
export function useGetCurrentProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentProfileQuery, GetCurrentProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentProfileQuery, GetCurrentProfileQueryVariables>(GetCurrentProfileDocument, options);
        }
export type GetCurrentProfileQueryHookResult = ReturnType<typeof useGetCurrentProfileQuery>;
export type GetCurrentProfileLazyQueryHookResult = ReturnType<typeof useGetCurrentProfileLazyQuery>;
export type GetCurrentProfileQueryResult = Apollo.QueryResult<GetCurrentProfileQuery, GetCurrentProfileQueryVariables>;
export const LoginDocument = gql`
    mutation login($username: String!, $password: String!) {
  createSession(username: $username, password: $password) {
    jwt
    message
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const ActivateNewUserDocument = gql`
    mutation activateNewUser($token: String!, $username: String!, $password: String!) {
  activateUser(username: $username, password: $password, token: $token) {
    jwt
    message
  }
}
    `;
export type ActivateNewUserMutationFn = Apollo.MutationFunction<ActivateNewUserMutation, ActivateNewUserMutationVariables>;

/**
 * __useActivateNewUserMutation__
 *
 * To run a mutation, you first call `useActivateNewUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useActivateNewUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [activateNewUserMutation, { data, loading, error }] = useActivateNewUserMutation({
 *   variables: {
 *      token: // value for 'token'
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useActivateNewUserMutation(baseOptions?: Apollo.MutationHookOptions<ActivateNewUserMutation, ActivateNewUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ActivateNewUserMutation, ActivateNewUserMutationVariables>(ActivateNewUserDocument, options);
      }
export type ActivateNewUserMutationHookResult = ReturnType<typeof useActivateNewUserMutation>;
export type ActivateNewUserMutationResult = Apollo.MutationResult<ActivateNewUserMutation>;
export type ActivateNewUserMutationOptions = Apollo.BaseMutationOptions<ActivateNewUserMutation, ActivateNewUserMutationVariables>;