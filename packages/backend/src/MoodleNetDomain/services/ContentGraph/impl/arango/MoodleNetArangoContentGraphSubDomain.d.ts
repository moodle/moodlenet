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
import { MoodleNetAuthenticatedExecutionContext, MoodleNetExecutionContext } from '../../../../MoodleNetGraphQL'
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
        <Type extends GQL.NodeType = GQL.NodeType>(_: {
          _key: IdKey
          nodeType: Type
          ctx: MoodleNetExecutionContext
        }) => Promise<ShallowNodeByType<Type> | null>
      >
      Create: WrkDef<
        <Type extends GQL.NodeType>(_: {
          ctx: MoodleNetAuthenticatedExecutionContext
          key?: IdKey // remove this .. it was only necessary for profile creation on accuont activation, change the flow and disjoint the two
          nodeType: Type
          data: CreateNodeData<Type>
        }) => Promise<ShallowNodeByType<Type> | CreateNodeMutationErrorType>
      >
      Created: Event<{ node: ShallowNode }>
    }
    Edge: {
      Create: WrkDef<
        <Type extends GQL.EdgeType>(_: {
          ctx: MoodleNetAuthenticatedExecutionContext
          data: CreateEdgeData<Type>
          edgeType: Type
          from: Id
          to: Id
          key?: IdKey // remove this .. it was only necessary for profile creation on accuont activation, change the flow and disjoint the two
        }) => Promise<ShallowEdgeByType<Type> | CreateEdgeMutationErrorType>
      >
      Created: Event<{ edge: ShallowEdge }>
      Traverse: WrkDef<
        (_: {
          parentNodeId: Id
          edgeType: GQL.EdgeType
          targetNodeType: GQL.NodeType
          inverse: boolean
          page: Maybe<GQL.PaginationInput>
          targetNodeIds: Maybe<Id[]>
        }) => Promise<GQL.RelPage>
      >
    }
    GlobalSearch: WrkDef<
      (_: {
        text: string
        page: Maybe<GQL.PaginationInput>
        nodeTypes: Maybe<GQL.NodeType[]>
        sortBy: Maybe<GQL.GlobalSearchSort>
      }) => Promise<GQL.SearchPage>
    >
    Stats: {
      MaintainEdgeCounters: SubDef<MoodleNetArangoContentGraphSubDomain, 'ContentGraph.Edge.Created'>
    }
  }
>
