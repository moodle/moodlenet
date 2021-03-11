import { Id, IdKey } from '@moodlenet/common/lib/utils/content-graph'
import { Event } from '../../../../../lib/domain/event'
import { SubDef } from '../../../../../lib/domain/sub'
import { SubDomain } from '../../../../../lib/domain/types'
import { WrkDef } from '../../../../../lib/domain/wrk'
import { MoodleNetDomain } from '../../../../MoodleNetDomain'
import { MoodleNetExecutionContext } from '../../../../MoodleNetGraphQL'
import * as GQL from '../../ContentGraph.graphql.gen'
import {
  CreateEdgeData,
  CreateEdgeShallowPayload,
  CreateNodeData,
  CreateNodeShallowPayload,
  ShallowEdge,
  ShallowNode,
} from '../../types.node'
export type MoodleNetArangoContentGraphSubDomain = SubDomain<
  MoodleNetDomain,
  'ContentGraph',
  {
    Node: {
      ById: WrkDef<
        <N extends GQL.Node = GQL.Node>({
          // ctx,
          _id,
        }: {
          _id: Id
          ctx: MoodleNetExecutionContext
        }) => Promise<ShallowNode<N> | null>
      >
      Create: WrkDef<
        <Type extends GQL.NodeType>(_: {
          ctx: MoodleNetExecutionContext
          key?: IdKey // remove this .. it was only necessary for user creation on accuont activation, change the flow and disjoint the two
          nodeType: Type
          data: CreateNodeData<Type>
        }) => Promise<CreateNodeShallowPayload<Type>>
      >
      Created: Event<{ node: ShallowNode }>
    }
    Edge: {
      Create: WrkDef<
        <Type extends GQL.EdgeType>({
          ctx,
          data,
          edgeType,
          from,
          to,
          key,
        }: {
          ctx: MoodleNetExecutionContext
          edgeType: Type
          key?: IdKey // remove this .. it was only necessary for user creation on accuont activation, change the flow and disjoint the two
          data: CreateEdgeData<Type>
          from: Id
          to: Id
        }) => Promise<CreateEdgeShallowPayload<Type>>
      >
      Created: Event<{ edge: ShallowEdge }>
    }
    Counters: {
      GlyphCreate: SubDef<
        MoodleNetArangoContentGraphSubDomain,
        'ContentGraph.Edge.Created' | 'ContentGraph.Node.Created'
      >
    }
  }
>
