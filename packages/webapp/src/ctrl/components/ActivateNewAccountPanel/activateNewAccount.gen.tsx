import * as Types from '../../../graphql/pub.graphql.link';

import { ShallowSessionFragment } from '../../../graphql/fragment/userAccount.gen';
import { ShallowUserFragment } from '../../../graphql/fragment/shallowNodes.gen';
import { gql } from '@apollo/client';
import { ShallowSessionFragmentDoc } from '../../../graphql/fragment/userAccount.gen';
import { ShallowUserFragmentDoc } from '../../../graphql/fragment/shallowNodes.gen';
import * as Apollo from '@apollo/client';
export type ActivateNewAccountMutationVariables = Types.Exact<{
  token: Types.Scalars['String'];
  username: Types.Scalars['String'];
  password: Types.Scalars['String'];
}>;


export type ActivateNewAccountMutation = (
  { __typename: 'Mutation' }
  & { activateAccount: (
    { __typename: 'ActivationOutcome' }
    & Pick<Types.ActivationOutcome, 'message'>
    & { session?: Types.Maybe<(
      { __typename: 'UserSession' }
      & { user: (
        { __typename: 'User' }
        & ShallowUserFragment
      ) }
      & ShallowSessionFragment
    )> }
  ) }
);


export const ActivateNewAccountDocument = gql`
    mutation activateNewAccount($token: String!, $username: String!, $password: String!) {
  activateAccount(username: $username, password: $password, token: $token) {
    message
    session {
      ...ShallowSession
      user {
        ...ShallowUser
      }
    }
  }
}
    ${ShallowSessionFragmentDoc}
${ShallowUserFragmentDoc}`;
export type ActivateNewAccountMutationFn = Apollo.MutationFunction<ActivateNewAccountMutation, ActivateNewAccountMutationVariables>;

/**
 * __useActivateNewAccountMutation__
 *
 * To run a mutation, you first call `useActivateNewAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useActivateNewAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [activateNewAccountMutation, { data, loading, error }] = useActivateNewAccountMutation({
 *   variables: {
 *      token: // value for 'token'
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useActivateNewAccountMutation(baseOptions?: Apollo.MutationHookOptions<ActivateNewAccountMutation, ActivateNewAccountMutationVariables>) {
        return Apollo.useMutation<ActivateNewAccountMutation, ActivateNewAccountMutationVariables>(ActivateNewAccountDocument, baseOptions);
      }
export type ActivateNewAccountMutationHookResult = ReturnType<typeof useActivateNewAccountMutation>;
export type ActivateNewAccountMutationResult = Apollo.MutationResult<ActivateNewAccountMutation>;
export type ActivateNewAccountMutationOptions = Apollo.BaseMutationOptions<ActivateNewAccountMutation, ActivateNewAccountMutationVariables>;