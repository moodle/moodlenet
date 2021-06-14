import { Edge, Node } from '../../../../ContentGraph.graphql.gen'

export type Fake<T extends Node | Edge> = Omit<T, 'id' | `_${string}`>
