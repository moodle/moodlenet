import {
  CreateEdgeMutationErrorType,
  CreateNodeMutationErrorType,
  DeleteEdgeMutationErrorType,
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
  DocumentEdge,
  DocumentEdgeByType,
  DocumentEdgeDataByType,
  DocumentNode,
  DocumentNodeByType,
  DocumentNodeDataByType,
} from './functions/types'
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
        }) => Promise<DocumentNodeByType<Type> | null>
      >
      Create: WrkDef<
        <Type extends GQL.NodeType>(_: {
          ctx: MoodleNetAuthenticatedExecutionContext //TODO try make them MoodleNetExecutionContext
          key?: IdKey // remove this .. it was only necessary for profile creation on accuont activation, change the flow and disjoint the two
          nodeType: Type
          data: DocumentNodeDataByType<Type>
        }) => Promise<DocumentNodeByType<Type> | CreateNodeMutationErrorType>
      >
      Created: Event<{ node: DocumentNode; creatorProfileId: Id }>
    }
    Edge: {
      Create: WrkDef<
        <Type extends GQL.EdgeType>(_: {
          ctx: MoodleNetAuthenticatedExecutionContext //TODO try make them MoodleNetExecutionContext
          data: DocumentEdgeDataByType<Type>
          edgeType: Type
          from: Id
          to: Id
          key?: IdKey // remove this .. it was only necessary for profile creation on accuont activation, change the flow and disjoint the two
        }) => Promise<DocumentEdgeByType<Type> | CreateEdgeMutationErrorType>
      >
      Delete: WrkDef<
        <Type extends GQL.EdgeType>(_: {
          ctx: MoodleNetAuthenticatedExecutionContext //TODO try make them MoodleNetExecutionContext
          edgeType: Type
          edgeId: Id
        }) => Promise<DocumentEdgeByType<Type> | DeleteEdgeMutationErrorType>
      >
      Created: Event<{ edge: DocumentEdge; creatorProfileId: Id }>
      Deleted: Event<{ edge: DocumentEdge; deleterProfileId: Id }>
      Traverse: WrkDef<
        (_: {
          ctx: MoodleNetExecutionContext
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
      MaintainEdgeCounters: {
        Created: SubDef<MoodleNetArangoContentGraphSubDomain, 'ContentGraph.Edge.Created'>
        Deleted: SubDef<MoodleNetArangoContentGraphSubDomain, 'ContentGraph.Edge.Deleted'>
      }
    }
  }
>
