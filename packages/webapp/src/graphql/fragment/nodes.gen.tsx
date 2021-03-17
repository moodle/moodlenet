import * as Types from '../pub.graphql.link';

import { gql } from '@apollo/client';
export type ShallowProfileFragment = (
  { __typename: 'Profile' }
  & Pick<Types.Profile, '_id' | 'name'>
);

export type BaseIContentNode_Collection_Fragment = (
  { __typename: 'Collection' }
  & Pick<Types.Collection, 'name' | 'icon' | 'summary'>
);

export type BaseIContentNode_Profile_Fragment = (
  { __typename: 'Profile' }
  & Pick<Types.Profile, 'name' | 'icon' | 'summary'>
);

export type BaseIContentNode_Resource_Fragment = (
  { __typename: 'Resource' }
  & Pick<Types.Resource, 'name' | 'icon' | 'summary'>
);

export type BaseIContentNode_Subject_Fragment = (
  { __typename: 'Subject' }
  & Pick<Types.Subject, 'name' | 'icon' | 'summary'>
);

export type BaseIContentNodeFragment = BaseIContentNode_Collection_Fragment | BaseIContentNode_Profile_Fragment | BaseIContentNode_Resource_Fragment | BaseIContentNode_Subject_Fragment;

export type BaseINode_Collection_Fragment = (
  { __typename: 'Collection' }
  & Pick<Types.Collection, '_id'>
  & { _meta: (
    { __typename: 'NodeMeta' }
    & { relCount?: Types.Maybe<(
      { __typename: 'RelCountMap' }
      & { Follows?: Types.Maybe<(
        { __typename: 'RelCount' }
        & { from?: Types.Maybe<(
          { __typename: 'RelCountTargetMap' }
          & Pick<Types.RelCountTargetMap, 'Profile'>
        )> }
      )>, Likes?: Types.Maybe<(
        { __typename: 'RelCount' }
        & { from?: Types.Maybe<(
          { __typename: 'RelCountTargetMap' }
          & Pick<Types.RelCountTargetMap, 'Profile'>
        )> }
      )> }
    )> }
  ) }
);

export type BaseINode_Profile_Fragment = (
  { __typename: 'Profile' }
  & Pick<Types.Profile, '_id'>
  & { _meta: (
    { __typename: 'NodeMeta' }
    & { relCount?: Types.Maybe<(
      { __typename: 'RelCountMap' }
      & { Follows?: Types.Maybe<(
        { __typename: 'RelCount' }
        & { from?: Types.Maybe<(
          { __typename: 'RelCountTargetMap' }
          & Pick<Types.RelCountTargetMap, 'Profile'>
        )> }
      )>, Likes?: Types.Maybe<(
        { __typename: 'RelCount' }
        & { from?: Types.Maybe<(
          { __typename: 'RelCountTargetMap' }
          & Pick<Types.RelCountTargetMap, 'Profile'>
        )> }
      )> }
    )> }
  ) }
);

export type BaseINode_Resource_Fragment = (
  { __typename: 'Resource' }
  & Pick<Types.Resource, '_id'>
  & { _meta: (
    { __typename: 'NodeMeta' }
    & { relCount?: Types.Maybe<(
      { __typename: 'RelCountMap' }
      & { Follows?: Types.Maybe<(
        { __typename: 'RelCount' }
        & { from?: Types.Maybe<(
          { __typename: 'RelCountTargetMap' }
          & Pick<Types.RelCountTargetMap, 'Profile'>
        )> }
      )>, Likes?: Types.Maybe<(
        { __typename: 'RelCount' }
        & { from?: Types.Maybe<(
          { __typename: 'RelCountTargetMap' }
          & Pick<Types.RelCountTargetMap, 'Profile'>
        )> }
      )> }
    )> }
  ) }
);

export type BaseINode_Subject_Fragment = (
  { __typename: 'Subject' }
  & Pick<Types.Subject, '_id'>
  & { _meta: (
    { __typename: 'NodeMeta' }
    & { relCount?: Types.Maybe<(
      { __typename: 'RelCountMap' }
      & { Follows?: Types.Maybe<(
        { __typename: 'RelCount' }
        & { from?: Types.Maybe<(
          { __typename: 'RelCountTargetMap' }
          & Pick<Types.RelCountTargetMap, 'Profile'>
        )> }
      )>, Likes?: Types.Maybe<(
        { __typename: 'RelCount' }
        & { from?: Types.Maybe<(
          { __typename: 'RelCountTargetMap' }
          & Pick<Types.RelCountTargetMap, 'Profile'>
        )> }
      )> }
    )> }
  ) }
);

export type BaseINodeFragment = BaseINode_Collection_Fragment | BaseINode_Profile_Fragment | BaseINode_Resource_Fragment | BaseINode_Subject_Fragment;

export const ShallowProfileFragmentDoc = gql`
    fragment ShallowProfile on Profile {
  _id
  name
}
    `;
export const BaseIContentNodeFragmentDoc = gql`
    fragment BaseIContentNode on IContentNode {
  name
  icon
  summary
}
    `;
export const BaseINodeFragmentDoc = gql`
    fragment BaseINode on INode {
  _id
  _meta {
    relCount {
      Follows {
        from {
          Profile
        }
      }
      Likes {
        from {
          Profile
        }
      }
    }
  }
}
    `;