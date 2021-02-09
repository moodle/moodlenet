import * as Types from '../pub.graphql.link';

import { gql } from '@apollo/client';
export type ShallowSessionFragment = (
  { __typename: 'UserSession' }
  & Pick<Types.UserSession, 'username' | 'email' | 'accountId' | 'jwt'>
);

export const ShallowSessionFragmentDoc = gql`
    fragment ShallowSession on UserSession {
  username
  email
  accountId
  jwt
}
    `;