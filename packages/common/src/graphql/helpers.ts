import { NodeType } from './types.graphql.gen'

export const maybeNodeOfType =
  <T extends NodeType>(t: T[]) =>
  <N extends { __typename: NodeType }>(_: N | null | undefined): (N & { __typename: T }) | null | undefined =>
    isOfNodeType(t)(_) ? (_ as any) : null

export const isOfNodeType =
  <T extends NodeType>(t: T[]) =>
  <N extends { __typename: NodeType }>(_: N | null | undefined): _ is N & { __typename: T } =>
    _ ? (t.includes(_.__typename as any) ? true : false) : false

export const isEdgeNodeOfType =
  <T extends NodeType>(t: T[]) =>
  <E extends { node: { __typename: NodeType } }>(
    _: E | null | undefined,
  ): _ is E & { node: E['node'] & { __typename: T } } =>
    isOfNodeType(t)(_?.node)
