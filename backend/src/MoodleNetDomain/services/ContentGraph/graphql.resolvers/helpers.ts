import { Edge, Node } from '../ContentGraph.graphql.gen'

export const unshallowForResolver = <N extends Node | Edge>(
  shallow: Pick<N, '_id'>
): N => shallow as N
