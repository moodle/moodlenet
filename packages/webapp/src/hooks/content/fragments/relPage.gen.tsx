import * as Types from '../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
export type JustEdgeIdRelPageFragment = (
  { __typename: 'RelPage' }
  & { edges: Array<(
    { __typename: 'RelPageEdge' }
    & { edge: (
      { __typename: 'AppliesTo' }
      & Pick<Types.AppliesTo, '_id'>
    ) | (
      { __typename: 'Contains' }
      & Pick<Types.Contains, '_id'>
    ) | (
      { __typename: 'Created' }
      & Pick<Types.Created, '_id'>
    ) | (
      { __typename: 'Follows' }
      & Pick<Types.Follows, '_id'>
    ) | (
      { __typename: 'Likes' }
      & Pick<Types.Likes, '_id'>
    ) }
  )> }
);

export const JustEdgeIdRelPageFragmentDoc = gql`
    fragment JustEdgeIdRelPage on RelPage {
  edges {
    edge {
      ... on IEdge {
        _id
      }
    }
  }
}
    `;