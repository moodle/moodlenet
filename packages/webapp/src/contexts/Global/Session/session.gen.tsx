import * as Types from '../../../graphql/pub.graphql.link';

import { ShallowProfileFragment } from '../../../graphql/fragment/nodes.gen';
import { gql } from '@apollo/client';
import { ShallowProfileFragmentDoc } from '../../../graphql/fragment/nodes.gen';
import * as Apollo from '@apollo/client';
export type GetCurrentSessionQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetCurrentSessionQuery = (
  { __typename: 'Query' }
  & { getSession?: Types.Maybe<(
    { __typename: 'UserSession' }
    & UserSessionWithProfileInfoFragment
  )> }
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

export type UserSessionWithProfileInfoFragment = (
  { __typename: 'UserSession' }
  & Pick<Types.UserSession, 'username' | 'email' | 'userId'>
  & { profile?: Types.Maybe<(
    { __typename: 'Profile' }
    & { myOwnCollections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, '_id' | 'name' | 'icon'>
        ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'Subject' } }
      )> }
    ) }
    & ShallowProfileFragment
  )> }
);

export const UserSessionWithProfileInfoFragmentDoc = gql`
    fragment UserSessionWithProfileInfo on UserSession {
  username
  email
  userId
  profile {
    ...ShallowProfile
    myOwnCollections: _rel(
      edge: {type: Created, node: Collection}
      page: {first: 100}
    ) {
      edges {
        node {
          ... on Collection {
            _id
            name
            icon
          }
        }
      }
    }
  }
}
    ${ShallowProfileFragmentDoc}`;
export const GetCurrentSessionDocument = gql`
    query getCurrentSession {
  getSession {
    ...UserSessionWithProfileInfo
  }
}
    ${UserSessionWithProfileInfoFragmentDoc}`;

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
        return Apollo.useQuery<GetCurrentSessionQuery, GetCurrentSessionQueryVariables>(GetCurrentSessionDocument, baseOptions);
      }
export function useGetCurrentSessionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentSessionQuery, GetCurrentSessionQueryVariables>) {
          return Apollo.useLazyQuery<GetCurrentSessionQuery, GetCurrentSessionQueryVariables>(GetCurrentSessionDocument, baseOptions);
        }
export type GetCurrentSessionQueryHookResult = ReturnType<typeof useGetCurrentSessionQuery>;
export type GetCurrentSessionLazyQueryHookResult = ReturnType<typeof useGetCurrentSessionLazyQuery>;
export type GetCurrentSessionQueryResult = Apollo.QueryResult<GetCurrentSessionQuery, GetCurrentSessionQueryVariables>;
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
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
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
        return Apollo.useMutation<ActivateNewUserMutation, ActivateNewUserMutationVariables>(ActivateNewUserDocument, baseOptions);
      }
export type ActivateNewUserMutationHookResult = ReturnType<typeof useActivateNewUserMutation>;
export type ActivateNewUserMutationResult = Apollo.MutationResult<ActivateNewUserMutation>;
export type ActivateNewUserMutationOptions = Apollo.BaseMutationOptions<ActivateNewUserMutation, ActivateNewUserMutationVariables>;