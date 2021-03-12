import {
  CreateEdgeMutationErrorType,
  CreateNodeMutationErrorType,
  Id,
  IdKey,
} from '@moodlenet/common/lib/utils/content-graph'
import { Maybe } from 'graphql/jsutils/Maybe'
import { Event } from '../../../../../lib/domain/event'
import { SubDef } from '../../../../../lib/domain/sub'
import { SubDomain } from '../../../../../lib/domain/types'
import { WrkDef } from '../../../../../lib/domain/wrk'
import { MoodleNetDomain } from '../../../../MoodleNetDomain'
import { MoodleNetExecutionContext } from '../../../../MoodleNetGraphQL'
import * as GQL from '../../ContentGraph.graphql.gen'
import {
  CreateEdgeData,
  CreateNodeData,
  ShallowEdge,
  ShallowEdgeByType,
  ShallowNode,
  ShallowNodeByType,
} from '../../types.node'
export type MoodleNetArangoContentGraphSubDomain = SubDomain<
  MoodleNetDomain,
  'ContentGraph',
  {
    Node: {
      ById: WrkDef<
        <Type extends GQL.Node = GQL.Node>(_: {
          _id: Id
          ctx: MoodleNetExecutionContext
        }) => Promise<ShallowNode<Type> | null>
      >
      Create: WrkDef<
        <Type extends GQL.NodeType>(_: {
          ctx: MoodleNetExecutionContext
          key?: IdKey // remove this .. it was only necessary for user creation on accuont activation, change the flow and disjoint the two
          nodeType: Type
          data: CreateNodeData<Type>
        }) => Promise<ShallowNodeByType<Type> | CreateNodeMutationErrorType>
      >
      Created: Event<{ node: ShallowNode }>
    }
    Edge: {
      Create: WrkDef<
        <Type extends GQL.EdgeType>(_: {
          ctx: MoodleNetExecutionContext
          edgeType: Type
          key?: IdKey // remove this .. it was only necessary for user creation on accuont activation, change the flow and disjoint the two
          data: CreateEdgeData<Type>
          from: Id
          to: Id
        }) => Promise<ShallowEdgeByType<Type> | CreateEdgeMutationErrorType>
      >
      Created: Event<{ edge: ShallowEdge }>
      Traverse: WrkDef<
        ({
          edgeType,
          page,
          parentNodeId,
          inverse,
          targetNodeType,
        }: {
          parentNodeId: Id
          edgeType: GQL.EdgeType
          targetNodeType: GQL.NodeType
          inverse: boolean
          page: Maybe<GQL.PaginationInput>
          ctx: MoodleNetExecutionContext
          sort: Maybe<GQL.NodeRelSort[]>
        }) => Promise<GQL.RelPage>
      >
    }
    GlobalSearch: WrkDef<
      ({ page, text }: { text: string; page: Maybe<GQL.PaginationInput> }) => Promise<GQL.SearchPage>
    >
    Counters: {
      GlyphCreate: SubDef<
        MoodleNetArangoContentGraphSubDomain,
        'ContentGraph.Edge.Created' | 'ContentGraph.Node.Created'
      >
    }
  }
>
