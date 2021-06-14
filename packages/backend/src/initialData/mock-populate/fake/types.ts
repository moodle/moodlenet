import { Edge, Node } from '@moodlenet/common/lib/graphql/types.graphql.gen'

export type Fake<T extends Node | Edge> = Omit<T, 'id' | `_${string}`>
