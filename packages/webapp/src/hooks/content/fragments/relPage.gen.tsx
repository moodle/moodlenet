import * as Types from '../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
export type JustEdgeIdRelPageFragment = (
  { __typename: 'RelPage' }
  & { edges: Array<(
    { __typename: 'RelPageEdge' }
    & { edge: (
      { __typename: 'AppliesTo' }
      & Pick<Types.AppliesTo, 'id'>
    ) | (
      { __typename: 'Contains' }
      & Pick<Types.Contains, 'id'>
    ) | (
      { __typename: 'Created' }
      & Pick<Types.Created, 'id'>
    ) | (
      { __typename: 'Follows' }
      & Pick<Types.Follows, 'id'>
    ) | (
      { __typename: 'Likes' }
      & Pick<Types.Likes, 'id'>
    ) }
  )> }
);

export const JustEdgeIdRelPageFragmentDoc = gql`
    fragment JustEdgeIdRelPage on RelPage {
  edges {
    edge {
      ... on IEdge {
        id
      }
    }
  }
}
    `;