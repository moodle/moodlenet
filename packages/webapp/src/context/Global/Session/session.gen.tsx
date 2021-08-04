import * as Types from '../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type GetCurrentSessionQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetCurrentSessionQuery = (
  { __typename: 'Query' }
  & { getSession?: Types.Maybe<(
    { __typename: 'UserSession' }
    & UserSessionFragment
  )> }
);

export type UserSessionFragment = (
  { __typename: 'UserSession' }
  & Pick<Types.UserSession, 'email'>
  & { profile: (
    { __typename: 'Profile' }
    & Pick<Types.Profile, 'id' | 'name' | 'avatar'>
    & { myOwnCollections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name'>
        ) | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } }
      )> }
    ) }
  ) }
);

export type LoginMutationVariables = Types.Exact<{
  email: Types.Scalars['String'];
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
  activationToken: Types.Scalars['String'];
  name: Types.Scalars['String'];
  password: Types.Scalars['String'];
}>;


export type ActivateNewUserMutation = (
  { __typename: 'Mutation' }
  & { activateUser: (
    { __typename: 'CreateSession' }
    & Pick<Types.CreateSession, 'jwt' | 'message'>
  ) }
);

export type SignUpMutationVariables = Types.Exact<{
  email: Types.Scalars['String'];
}>;


export type SignUpMutation = (
  { __typename: 'Mutation' }
  & { signUp: (
    { __typename: 'SimpleResponse' }
    & Pick<Types.SimpleResponse, 'success' | 'message'>
  ) }
);

export const UserSessionFragmentDoc = gql`
    fragment UserSession on UserSession {
  email
  profile {
    id
    name
    avatar
    myOwnCollections: _rel(type: Created, target: Collection, page: {first: 100}) {
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
    `;
export const GetCurrentSessionDocument = gql`
    query getCurrentSession {
  getSession {
    ...UserSession
  }
}
    ${UserSessionFragmentDoc}`;

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
export const LoginDocument = gql`
    mutation login($email: String!, $password: String!) {
  createSession(email: $email, password: $password) {
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
 *      email: // value for 'email'
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
    mutation activateNewUser($activationToken: String!, $name: String!, $password: String!) {
  activateUser(
    name: $name
    password: $password
    activationToken: $activationToken
  ) {
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
 *      activationToken: // value for 'activationToken'
 *      name: // value for 'name'
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
export const SignUpDocument = gql`
    mutation signUp($email: String!) {
  signUp(email: $email) {
    success
    message
  }
}
    `;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;