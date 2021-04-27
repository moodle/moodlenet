import { AssetRef } from '@moodlenet/common/lib/pub-graphql/types'
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql'
import { MoodleNetExecutionContext, RootValue } from '../../MoodleNetGraphQL'
import { Id } from './types'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } &
  { [P in K]-?: NonNullable<T[P]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: Id
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Never: never
  Empty: {}
  DateTime: Date
  Cursor: string
  AssetRef: AssetRef
}

export type CtxAssertion = 'ExecutorIsAuthenticated' | 'ExecutorIsSystem' | 'ExecutorIsAdmin' | 'ExecutorIsAnonymous'

export type NodeAssertion = 'ExecutorCreatedThisNode' | 'ThisNodeIsExecutorProfile'

export type ConnAssertion =
  | 'NoExistingSameEdgeTypeInSameDirectionBetweenTheSameTwoNodes'
  | 'NoExistingSameEdgeTypeToThisNode'

export type Mutation = {
  __typename: 'Mutation'
  createEdge: CreateEdgeMutationPayload
  createNode: CreateNodeMutationPayload
  updateEdge: UpdateEdgeMutationPayload
  updateNode: UpdateNodeMutationPayload
  deleteEdge: DeleteEdgeMutationPayload
  deleteNode: DeleteNodeMutationPayload
}

export type MutationCreateEdgeArgs = {
  input: CreateEdgeInput
}

export type MutationCreateNodeArgs = {
  input: CreateNodeInput
}

export type MutationUpdateEdgeArgs = {
  input: UpdateEdgeInput
}

export type MutationUpdateNodeArgs = {
  input: UpdateNodeInput
}

export type MutationDeleteEdgeArgs = {
  input: DeleteEdgeInput
}

export type MutationDeleteNodeArgs = {
  input: DeleteNodeInput
}

export type CreateNodeInput = {
  Collection?: Maybe<CreateCollectionInput>
  Profile?: Maybe<CreateProfileInput>
  Resource?: Maybe<CreateResourceInput>
  Subject?: Maybe<CreateSubjectInput>
  nodeType: NodeType
}

export type CreateNodeMutationPayload = CreateNodeMutationSuccess | CreateNodeMutationError

export type CreateNodeMutationSuccess = {
  __typename: 'CreateNodeMutationSuccess'
  node: Node
}

export type CreateNodeMutationError = {
  __typename: 'CreateNodeMutationError'
  type: CreateNodeMutationErrorType
  details?: Maybe<Scalars['String']>
}

export type CreateNodeMutationErrorType = 'NotAuthorized' | 'UnexpectedInput' | 'AssertionFailed'

export type CreateEdgeInput = {
  AppliesTo?: Maybe<Scalars['Empty']>
  Contains?: Maybe<Scalars['Empty']>
  Created?: Maybe<Scalars['Empty']>
  Follows?: Maybe<Scalars['Empty']>
  Likes?: Maybe<Scalars['Empty']>
  edgeType: EdgeType
  from: Scalars['ID']
  to: Scalars['ID']
}

export type CreateEdgeMutationPayload = CreateEdgeMutationSuccess | CreateEdgeMutationError

export type CreateEdgeMutationSuccess = {
  __typename: 'CreateEdgeMutationSuccess'
  edge: Edge
}

export type CreateEdgeMutationError = {
  __typename: 'CreateEdgeMutationError'
  type: CreateEdgeMutationErrorType
  details?: Maybe<Scalars['String']>
}

export type CreateEdgeMutationErrorType =
  | 'NotAuthorized'
  | 'NotAllowed'
  | 'AssertionFailed'
  | 'NoSelfReference'
  | 'UnexpectedInput'

export type UpdateNodeInput = {
  Collection?: Maybe<UpdateCollectionInput>
  Profile?: Maybe<UpdateProfileInput>
  Resource?: Maybe<UpdateResourceInput>
  Subject?: Maybe<UpdateSubjectInput>
  id: Scalars['ID']
  nodeType: NodeType
}

export type UpdateNodeMutationPayload = UpdateNodeMutationSuccess | UpdateNodeMutationError

export type UpdateNodeMutationSuccess = {
  __typename: 'UpdateNodeMutationSuccess'
  node?: Maybe<Node>
}

export type UpdateNodeMutationError = {
  __typename: 'UpdateNodeMutationError'
  type: UpdateNodeMutationErrorType
  details?: Maybe<Scalars['String']>
}

export type UpdateNodeMutationErrorType = 'NotFound' | 'NotAuthorized' | 'UnexpectedInput' | 'AssertionFailed'

export type UpdateEdgeInput = {
  AppliesTo?: Maybe<Scalars['Empty']>
  Contains?: Maybe<Scalars['Empty']>
  Created?: Maybe<Scalars['Empty']>
  Follows?: Maybe<Scalars['Empty']>
  Likes?: Maybe<Scalars['Empty']>
  edgeType: EdgeType
  id: Scalars['ID']
}

export type UpdateEdgeMutationPayload = UpdateEdgeMutationSuccess | UpdateEdgeMutationError

export type UpdateEdgeMutationSuccess = {
  __typename: 'UpdateEdgeMutationSuccess'
  edge?: Maybe<Edge>
}

export type UpdateEdgeMutationError = {
  __typename: 'UpdateEdgeMutationError'
  type: UpdateEdgeMutationErrorType
  details?: Maybe<Scalars['String']>
}

export type UpdateEdgeMutationErrorType = 'NotFound' | 'NotAuthorized' | 'UnexpectedInput' | 'AssertionFailed'

export type DeleteEdgeInput = {
  id: Scalars['ID']
  edgeType: EdgeType
}

export type DeleteEdgeMutationPayload = DeleteEdgeMutationSuccess | DeleteEdgeMutationError

export type DeleteEdgeMutationSuccess = {
  __typename: 'DeleteEdgeMutationSuccess'
  edgeId?: Maybe<Scalars['ID']>
}

export type DeleteEdgeMutationError = {
  __typename: 'DeleteEdgeMutationError'
  type?: Maybe<DeleteEdgeMutationErrorType>
  details?: Maybe<Scalars['String']>
}

export type DeleteEdgeMutationErrorType = 'NotFound' | 'NotAuthorized' | 'UnexpectedInput' | 'AssertionFailed'

export type DeleteNodeInput = {
  id: Scalars['ID']
  nodeType: NodeType
}

export type DeleteNodeMutationPayload = DeleteNodeMutationSuccess | DeleteNodeMutationError

export type DeleteNodeMutationSuccess = {
  __typename: 'DeleteNodeMutationSuccess'
  nodeId?: Maybe<Scalars['ID']>
}

export type DeleteNodeMutationError = {
  __typename: 'DeleteNodeMutationError'
  type?: Maybe<DeleteNodeMutationErrorType>
  details?: Maybe<Scalars['String']>
}

export type DeleteNodeMutationErrorType = 'NotFound' | 'NotAuthorized' | 'AssertionFailed'

export type Page = {
  pageInfo: PageInfo
  edges: Array<RelPageEdge | SearchPageEdge>
}

export type PageInfo = {
  __typename: 'PageInfo'
  endCursor?: Maybe<Scalars['Cursor']>
  hasNextPage: Scalars['Boolean']
  hasPreviousPage: Scalars['Boolean']
  startCursor?: Maybe<Scalars['Cursor']>
}

export type PageEdge = {
  cursor: Scalars['Cursor']
}

export type PaginationInput = {
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['Cursor']>
  before?: Maybe<Scalars['Cursor']>
  last?: Maybe<Scalars['Int']>
}

export type Query = {
  __typename: 'Query'
  getUserSessionProfile?: Maybe<UserSession>
  globalSearch: SearchPage
  node?: Maybe<Node>
}

export type QueryGetUserSessionProfileArgs = {
  profileId?: Maybe<Scalars['ID']>
}

export type QueryGlobalSearchArgs = {
  text: Scalars['String']
  nodeTypes?: Maybe<Array<NodeType>>
  sortBy: GlobalSearchSort
  page?: Maybe<PaginationInput>
}

export type QueryNodeArgs = {
  id: Scalars['ID']
}

export type IContentNode = {
  name: Scalars['String']
  summary: Scalars['String']
  icon?: Maybe<Scalars['AssetRef']>
}

export type ContentNodeInput = {
  name: Scalars['String']
  summary: Scalars['String']
  icon?: Maybe<AssetRefInput>
}

export type AssetRefInputType = 'TmpUpload' | 'ExternalUrl' | 'NoChange' | 'Remove'

export type AssetRefInput = {
  type: AssetRefInputType
  location: Scalars['String']
}

export type INode = {
  _created: GlyphByAt
  _lastEdited?: Maybe<GlyphByAt>
  _rel: RelPage
  _relCount: Scalars['Int']
  id: Scalars['ID']
}

export type INode_RelArgs = {
  edge: EdgeTypeInput
  page?: Maybe<PaginationInput>
}

export type INode_RelCountArgs = {
  type: EdgeType
  target: NodeType
  inverse?: Maybe<Scalars['Boolean']>
}

export type IEdge = {
  _created: GlyphByAt
  _lastEdited?: Maybe<GlyphByAt>
  id?: Maybe<Scalars['ID']>
}

export type AppliesTo = IEdge & {
  __typename: 'AppliesTo'
  _created: GlyphByAt
  _lastEdited?: Maybe<GlyphByAt>
  id: Scalars['ID']
}

export type Edge = AppliesTo | Contains | Created | Follows | Likes

export type EdgeType = 'AppliesTo' | 'Contains' | 'Created' | 'Follows' | 'Likes'

export type Contains = IEdge & {
  __typename: 'Contains'
  _created: GlyphByAt
  _lastEdited?: Maybe<GlyphByAt>
  id: Scalars['ID']
}

export type Created = IEdge & {
  __typename: 'Created'
  _created: GlyphByAt
  _lastEdited?: Maybe<GlyphByAt>
  id: Scalars['ID']
}

export type Follows = IEdge & {
  __typename: 'Follows'
  _created: GlyphByAt
  _lastEdited?: Maybe<GlyphByAt>
  id: Scalars['ID']
}

export type Likes = IEdge & {
  __typename: 'Likes'
  _created: GlyphByAt
  _lastEdited?: Maybe<GlyphByAt>
  id: Scalars['ID']
}

export type GlyphByAt = {
  __typename: 'GlyphByAt'
  by: Profile
  at: Scalars['DateTime']
}

export type Profile = IContentNode &
  INode & {
    __typename: 'Profile'
    _created: GlyphByAt
    _lastEdited?: Maybe<GlyphByAt>
    _rel: RelPage
    _relCount: Scalars['Int']
    icon?: Maybe<Scalars['AssetRef']>
    id: Scalars['ID']
    name: Scalars['String']
    summary: Scalars['String']
  }

export type Profile_RelArgs = {
  edge: EdgeTypeInput
  page?: Maybe<PaginationInput>
}

export type Profile_RelCountArgs = {
  type: EdgeType
  target: NodeType
  inverse?: Maybe<Scalars['Boolean']>
}

export type Collection = IContentNode &
  INode & {
    __typename: 'Collection'
    _created: GlyphByAt
    _lastEdited?: Maybe<GlyphByAt>
    _rel: RelPage
    _relCount: Scalars['Int']
    icon?: Maybe<Scalars['AssetRef']>
    id: Scalars['ID']
    name: Scalars['String']
    summary: Scalars['String']
  }

export type Collection_RelArgs = {
  edge: EdgeTypeInput
  page?: Maybe<PaginationInput>
}

export type Collection_RelCountArgs = {
  type: EdgeType
  target: NodeType
  inverse?: Maybe<Scalars['Boolean']>
}

export type Resource = IContentNode &
  INode & {
    __typename: 'Resource'
    _created: GlyphByAt
    _lastEdited?: Maybe<GlyphByAt>
    _rel: RelPage
    _relCount: Scalars['Int']
    icon?: Maybe<Scalars['AssetRef']>
    id: Scalars['ID']
    name: Scalars['String']
    summary: Scalars['String']
  }

export type Resource_RelArgs = {
  edge: EdgeTypeInput
  page?: Maybe<PaginationInput>
}

export type Resource_RelCountArgs = {
  type: EdgeType
  target: NodeType
  inverse?: Maybe<Scalars['Boolean']>
}

export type Subject = IContentNode &
  INode & {
    __typename: 'Subject'
    _created: GlyphByAt
    _lastEdited?: Maybe<GlyphByAt>
    _rel: RelPage
    _relCount: Scalars['Int']
    icon?: Maybe<Scalars['AssetRef']>
    id: Scalars['ID']
    name: Scalars['String']
    summary: Scalars['String']
  }

export type Subject_RelArgs = {
  edge: EdgeTypeInput
  page?: Maybe<PaginationInput>
}

export type Subject_RelCountArgs = {
  type: EdgeType
  target: NodeType
  inverse?: Maybe<Scalars['Boolean']>
}

export type EdgeTypeInput = {
  type: EdgeType
  node: NodeType
  inverse?: Maybe<Scalars['Boolean']>
  targetMe?: Maybe<Scalars['Boolean']>
  targetIDs?: Maybe<Array<Scalars['ID']>>
}

export type RelPage = Page & {
  __typename: 'RelPage'
  pageInfo: PageInfo
  edges: Array<RelPageEdge>
}

export type RelPageEdge = PageEdge & {
  __typename: 'RelPageEdge'
  cursor: Scalars['Cursor']
  edge: AppliesTo | Contains | Created | Follows | Likes
  node: Profile | Collection | Resource | Subject
}

export type UserSession = {
  __typename: 'UserSession'
  profile?: Maybe<Profile>
}

export type CreateCollectionInput = {
  content: ContentNodeInput
}

export type UpdateCollectionInput = {
  content: ContentNodeInput
}

export type Node = Collection | Profile | Resource | Subject

export type NodeType = 'Collection' | 'Profile' | 'Resource' | 'Subject'

export type UpdateProfileInput = {
  content: ContentNodeInput
}

export type CreateProfileInput = {
  content: ContentNodeInput
}

export type CreateResourceInput = {
  content: ContentNodeInput
}

export type UpdateResourceInput = {
  content: ContentNodeInput
}

export type CreateSubjectInput = {
  content: ContentNodeInput
}

export type UpdateSubjectInput = {
  content: ContentNodeInput
}

export type SearchPage = Page & {
  __typename: 'SearchPage'
  pageInfo: PageInfo
  edges: Array<SearchPageEdge>
}

export type SearchPageEdge = PageEdge & {
  __typename: 'SearchPageEdge'
  cursor: Scalars['Cursor']
  node: Profile | Collection | Resource | Subject
}

export type GlobalSearchSort = 'Relevance' | 'Popularity'

export type ResolverTypeWrapper<T> = Promise<T> | T

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Never: ResolverTypeWrapper<Scalars['Never']>
  Empty: ResolverTypeWrapper<Scalars['Empty']>
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>
  CtxAssertion: CtxAssertion
  NodeAssertion: NodeAssertion
  ConnAssertion: ConnAssertion
  Mutation: ResolverTypeWrapper<RootValue>
  CreateNodeInput: CreateNodeInput
  CreateNodeMutationPayload: ResolversTypes['CreateNodeMutationSuccess'] | ResolversTypes['CreateNodeMutationError']
  CreateNodeMutationSuccess: ResolverTypeWrapper<
    Omit<CreateNodeMutationSuccess, 'node'> & { node: ResolversTypes['Node'] }
  >
  CreateNodeMutationError: ResolverTypeWrapper<CreateNodeMutationError>
  String: ResolverTypeWrapper<Scalars['String']>
  CreateNodeMutationErrorType: CreateNodeMutationErrorType
  CreateEdgeInput: CreateEdgeInput
  ID: ResolverTypeWrapper<Scalars['ID']>
  CreateEdgeMutationPayload: ResolversTypes['CreateEdgeMutationSuccess'] | ResolversTypes['CreateEdgeMutationError']
  CreateEdgeMutationSuccess: ResolverTypeWrapper<
    Omit<CreateEdgeMutationSuccess, 'edge'> & { edge: ResolversTypes['Edge'] }
  >
  CreateEdgeMutationError: ResolverTypeWrapper<CreateEdgeMutationError>
  CreateEdgeMutationErrorType: CreateEdgeMutationErrorType
  UpdateNodeInput: UpdateNodeInput
  UpdateNodeMutationPayload: ResolversTypes['UpdateNodeMutationSuccess'] | ResolversTypes['UpdateNodeMutationError']
  UpdateNodeMutationSuccess: ResolverTypeWrapper<
    Omit<UpdateNodeMutationSuccess, 'node'> & { node?: Maybe<ResolversTypes['Node']> }
  >
  UpdateNodeMutationError: ResolverTypeWrapper<UpdateNodeMutationError>
  UpdateNodeMutationErrorType: UpdateNodeMutationErrorType
  UpdateEdgeInput: UpdateEdgeInput
  UpdateEdgeMutationPayload: ResolversTypes['UpdateEdgeMutationSuccess'] | ResolversTypes['UpdateEdgeMutationError']
  UpdateEdgeMutationSuccess: ResolverTypeWrapper<
    Omit<UpdateEdgeMutationSuccess, 'edge'> & { edge?: Maybe<ResolversTypes['Edge']> }
  >
  UpdateEdgeMutationError: ResolverTypeWrapper<UpdateEdgeMutationError>
  UpdateEdgeMutationErrorType: UpdateEdgeMutationErrorType
  DeleteEdgeInput: DeleteEdgeInput
  DeleteEdgeMutationPayload: ResolversTypes['DeleteEdgeMutationSuccess'] | ResolversTypes['DeleteEdgeMutationError']
  DeleteEdgeMutationSuccess: ResolverTypeWrapper<DeleteEdgeMutationSuccess>
  DeleteEdgeMutationError: ResolverTypeWrapper<DeleteEdgeMutationError>
  DeleteEdgeMutationErrorType: DeleteEdgeMutationErrorType
  DeleteNodeInput: DeleteNodeInput
  DeleteNodeMutationPayload: ResolversTypes['DeleteNodeMutationSuccess'] | ResolversTypes['DeleteNodeMutationError']
  DeleteNodeMutationSuccess: ResolverTypeWrapper<DeleteNodeMutationSuccess>
  DeleteNodeMutationError: ResolverTypeWrapper<DeleteNodeMutationError>
  DeleteNodeMutationErrorType: DeleteNodeMutationErrorType
  Page: ResolversTypes['RelPage'] | ResolversTypes['SearchPage']
  PageInfo: ResolverTypeWrapper<PageInfo>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  PageEdge: ResolversTypes['RelPageEdge'] | ResolversTypes['SearchPageEdge']
  PaginationInput: PaginationInput
  Int: ResolverTypeWrapper<Scalars['Int']>
  Query: ResolverTypeWrapper<RootValue>
  Cursor: ResolverTypeWrapper<Scalars['Cursor']>
  AssetRef: ResolverTypeWrapper<Scalars['AssetRef']>
  IContentNode:
    | ResolversTypes['Profile']
    | ResolversTypes['Collection']
    | ResolversTypes['Resource']
    | ResolversTypes['Subject']
  ContentNodeInput: ContentNodeInput
  AssetRefInputType: AssetRefInputType
  AssetRefInput: AssetRefInput
  INode:
    | ResolversTypes['Profile']
    | ResolversTypes['Collection']
    | ResolversTypes['Resource']
    | ResolversTypes['Subject']
  IEdge:
    | ResolversTypes['AppliesTo']
    | ResolversTypes['Contains']
    | ResolversTypes['Created']
    | ResolversTypes['Follows']
    | ResolversTypes['Likes']
  AppliesTo: ResolverTypeWrapper<AppliesTo>
  Edge:
    | ResolversTypes['AppliesTo']
    | ResolversTypes['Contains']
    | ResolversTypes['Created']
    | ResolversTypes['Follows']
    | ResolversTypes['Likes']
  EdgeType: EdgeType
  Contains: ResolverTypeWrapper<Contains>
  Created: ResolverTypeWrapper<Created>
  Follows: ResolverTypeWrapper<Follows>
  Likes: ResolverTypeWrapper<Likes>
  GlyphByAt: ResolverTypeWrapper<GlyphByAt>
  Profile: ResolverTypeWrapper<Profile>
  Collection: ResolverTypeWrapper<Collection>
  Resource: ResolverTypeWrapper<Resource>
  Subject: ResolverTypeWrapper<Subject>
  EdgeTypeInput: EdgeTypeInput
  RelPage: ResolverTypeWrapper<RelPage>
  RelPageEdge: ResolverTypeWrapper<RelPageEdge>
  UserSession: ResolverTypeWrapper<UserSession>
  CreateCollectionInput: CreateCollectionInput
  UpdateCollectionInput: UpdateCollectionInput
  Node:
    | ResolversTypes['Collection']
    | ResolversTypes['Profile']
    | ResolversTypes['Resource']
    | ResolversTypes['Subject']
  NodeType: NodeType
  UpdateProfileInput: UpdateProfileInput
  CreateProfileInput: CreateProfileInput
  CreateResourceInput: CreateResourceInput
  UpdateResourceInput: UpdateResourceInput
  CreateSubjectInput: CreateSubjectInput
  UpdateSubjectInput: UpdateSubjectInput
  SearchPage: ResolverTypeWrapper<SearchPage>
  SearchPageEdge: ResolverTypeWrapper<SearchPageEdge>
  GlobalSearchSort: GlobalSearchSort
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Never: Scalars['Never']
  Empty: Scalars['Empty']
  DateTime: Scalars['DateTime']
  Mutation: RootValue
  CreateNodeInput: CreateNodeInput
  CreateNodeMutationPayload:
    | ResolversParentTypes['CreateNodeMutationSuccess']
    | ResolversParentTypes['CreateNodeMutationError']
  CreateNodeMutationSuccess: Omit<CreateNodeMutationSuccess, 'node'> & { node: ResolversParentTypes['Node'] }
  CreateNodeMutationError: CreateNodeMutationError
  String: Scalars['String']
  CreateEdgeInput: CreateEdgeInput
  ID: Scalars['ID']
  CreateEdgeMutationPayload:
    | ResolversParentTypes['CreateEdgeMutationSuccess']
    | ResolversParentTypes['CreateEdgeMutationError']
  CreateEdgeMutationSuccess: Omit<CreateEdgeMutationSuccess, 'edge'> & { edge: ResolversParentTypes['Edge'] }
  CreateEdgeMutationError: CreateEdgeMutationError
  UpdateNodeInput: UpdateNodeInput
  UpdateNodeMutationPayload:
    | ResolversParentTypes['UpdateNodeMutationSuccess']
    | ResolversParentTypes['UpdateNodeMutationError']
  UpdateNodeMutationSuccess: Omit<UpdateNodeMutationSuccess, 'node'> & { node?: Maybe<ResolversParentTypes['Node']> }
  UpdateNodeMutationError: UpdateNodeMutationError
  UpdateEdgeInput: UpdateEdgeInput
  UpdateEdgeMutationPayload:
    | ResolversParentTypes['UpdateEdgeMutationSuccess']
    | ResolversParentTypes['UpdateEdgeMutationError']
  UpdateEdgeMutationSuccess: Omit<UpdateEdgeMutationSuccess, 'edge'> & { edge?: Maybe<ResolversParentTypes['Edge']> }
  UpdateEdgeMutationError: UpdateEdgeMutationError
  DeleteEdgeInput: DeleteEdgeInput
  DeleteEdgeMutationPayload:
    | ResolversParentTypes['DeleteEdgeMutationSuccess']
    | ResolversParentTypes['DeleteEdgeMutationError']
  DeleteEdgeMutationSuccess: DeleteEdgeMutationSuccess
  DeleteEdgeMutationError: DeleteEdgeMutationError
  DeleteNodeInput: DeleteNodeInput
  DeleteNodeMutationPayload:
    | ResolversParentTypes['DeleteNodeMutationSuccess']
    | ResolversParentTypes['DeleteNodeMutationError']
  DeleteNodeMutationSuccess: DeleteNodeMutationSuccess
  DeleteNodeMutationError: DeleteNodeMutationError
  Page: ResolversParentTypes['RelPage'] | ResolversParentTypes['SearchPage']
  PageInfo: PageInfo
  Boolean: Scalars['Boolean']
  PageEdge: ResolversParentTypes['RelPageEdge'] | ResolversParentTypes['SearchPageEdge']
  PaginationInput: PaginationInput
  Int: Scalars['Int']
  Query: RootValue
  Cursor: Scalars['Cursor']
  AssetRef: Scalars['AssetRef']
  IContentNode:
    | ResolversParentTypes['Profile']
    | ResolversParentTypes['Collection']
    | ResolversParentTypes['Resource']
    | ResolversParentTypes['Subject']
  ContentNodeInput: ContentNodeInput
  AssetRefInput: AssetRefInput
  INode:
    | ResolversParentTypes['Profile']
    | ResolversParentTypes['Collection']
    | ResolversParentTypes['Resource']
    | ResolversParentTypes['Subject']
  IEdge:
    | ResolversParentTypes['AppliesTo']
    | ResolversParentTypes['Contains']
    | ResolversParentTypes['Created']
    | ResolversParentTypes['Follows']
    | ResolversParentTypes['Likes']
  AppliesTo: AppliesTo
  Edge:
    | ResolversParentTypes['AppliesTo']
    | ResolversParentTypes['Contains']
    | ResolversParentTypes['Created']
    | ResolversParentTypes['Follows']
    | ResolversParentTypes['Likes']
  Contains: Contains
  Created: Created
  Follows: Follows
  Likes: Likes
  GlyphByAt: GlyphByAt
  Profile: Profile
  Collection: Collection
  Resource: Resource
  Subject: Subject
  EdgeTypeInput: EdgeTypeInput
  RelPage: RelPage
  RelPageEdge: RelPageEdge
  UserSession: UserSession
  CreateCollectionInput: CreateCollectionInput
  UpdateCollectionInput: UpdateCollectionInput
  Node:
    | ResolversParentTypes['Collection']
    | ResolversParentTypes['Profile']
    | ResolversParentTypes['Resource']
    | ResolversParentTypes['Subject']
  UpdateProfileInput: UpdateProfileInput
  CreateProfileInput: CreateProfileInput
  CreateResourceInput: CreateResourceInput
  UpdateResourceInput: UpdateResourceInput
  CreateSubjectInput: CreateSubjectInput
  UpdateSubjectInput: UpdateSubjectInput
  SearchPage: SearchPage
  SearchPageEdge: SearchPageEdge
}

export interface NeverScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Never'], any> {
  name: 'Never'
}

export interface EmptyScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Empty'], any> {
  name: 'Empty'
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export type MutationResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  createEdge?: Resolver<
    ResolversTypes['CreateEdgeMutationPayload'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateEdgeArgs, 'input'>
  >
  createNode?: Resolver<
    ResolversTypes['CreateNodeMutationPayload'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateNodeArgs, 'input'>
  >
  updateEdge?: Resolver<
    ResolversTypes['UpdateEdgeMutationPayload'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateEdgeArgs, 'input'>
  >
  updateNode?: Resolver<
    ResolversTypes['UpdateNodeMutationPayload'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateNodeArgs, 'input'>
  >
  deleteEdge?: Resolver<
    ResolversTypes['DeleteEdgeMutationPayload'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteEdgeArgs, 'input'>
  >
  deleteNode?: Resolver<
    ResolversTypes['DeleteNodeMutationPayload'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteNodeArgs, 'input'>
  >
}

export type CreateNodeMutationPayloadResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['CreateNodeMutationPayload'] = ResolversParentTypes['CreateNodeMutationPayload']
> = {
  __resolveType: TypeResolveFn<'CreateNodeMutationSuccess' | 'CreateNodeMutationError', ParentType, ContextType>
}

export type CreateNodeMutationSuccessResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['CreateNodeMutationSuccess'] = ResolversParentTypes['CreateNodeMutationSuccess']
> = {
  node?: Resolver<ResolversTypes['Node'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type CreateNodeMutationErrorResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['CreateNodeMutationError'] = ResolversParentTypes['CreateNodeMutationError']
> = {
  type?: Resolver<ResolversTypes['CreateNodeMutationErrorType'], ParentType, ContextType>
  details?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type CreateEdgeMutationPayloadResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['CreateEdgeMutationPayload'] = ResolversParentTypes['CreateEdgeMutationPayload']
> = {
  __resolveType: TypeResolveFn<'CreateEdgeMutationSuccess' | 'CreateEdgeMutationError', ParentType, ContextType>
}

export type CreateEdgeMutationSuccessResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['CreateEdgeMutationSuccess'] = ResolversParentTypes['CreateEdgeMutationSuccess']
> = {
  edge?: Resolver<ResolversTypes['Edge'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type CreateEdgeMutationErrorResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['CreateEdgeMutationError'] = ResolversParentTypes['CreateEdgeMutationError']
> = {
  type?: Resolver<ResolversTypes['CreateEdgeMutationErrorType'], ParentType, ContextType>
  details?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UpdateNodeMutationPayloadResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['UpdateNodeMutationPayload'] = ResolversParentTypes['UpdateNodeMutationPayload']
> = {
  __resolveType: TypeResolveFn<'UpdateNodeMutationSuccess' | 'UpdateNodeMutationError', ParentType, ContextType>
}

export type UpdateNodeMutationSuccessResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['UpdateNodeMutationSuccess'] = ResolversParentTypes['UpdateNodeMutationSuccess']
> = {
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UpdateNodeMutationErrorResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['UpdateNodeMutationError'] = ResolversParentTypes['UpdateNodeMutationError']
> = {
  type?: Resolver<ResolversTypes['UpdateNodeMutationErrorType'], ParentType, ContextType>
  details?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UpdateEdgeMutationPayloadResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['UpdateEdgeMutationPayload'] = ResolversParentTypes['UpdateEdgeMutationPayload']
> = {
  __resolveType: TypeResolveFn<'UpdateEdgeMutationSuccess' | 'UpdateEdgeMutationError', ParentType, ContextType>
}

export type UpdateEdgeMutationSuccessResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['UpdateEdgeMutationSuccess'] = ResolversParentTypes['UpdateEdgeMutationSuccess']
> = {
  edge?: Resolver<Maybe<ResolversTypes['Edge']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UpdateEdgeMutationErrorResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['UpdateEdgeMutationError'] = ResolversParentTypes['UpdateEdgeMutationError']
> = {
  type?: Resolver<ResolversTypes['UpdateEdgeMutationErrorType'], ParentType, ContextType>
  details?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type DeleteEdgeMutationPayloadResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['DeleteEdgeMutationPayload'] = ResolversParentTypes['DeleteEdgeMutationPayload']
> = {
  __resolveType: TypeResolveFn<'DeleteEdgeMutationSuccess' | 'DeleteEdgeMutationError', ParentType, ContextType>
}

export type DeleteEdgeMutationSuccessResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['DeleteEdgeMutationSuccess'] = ResolversParentTypes['DeleteEdgeMutationSuccess']
> = {
  edgeId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type DeleteEdgeMutationErrorResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['DeleteEdgeMutationError'] = ResolversParentTypes['DeleteEdgeMutationError']
> = {
  type?: Resolver<Maybe<ResolversTypes['DeleteEdgeMutationErrorType']>, ParentType, ContextType>
  details?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type DeleteNodeMutationPayloadResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['DeleteNodeMutationPayload'] = ResolversParentTypes['DeleteNodeMutationPayload']
> = {
  __resolveType: TypeResolveFn<'DeleteNodeMutationSuccess' | 'DeleteNodeMutationError', ParentType, ContextType>
}

export type DeleteNodeMutationSuccessResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['DeleteNodeMutationSuccess'] = ResolversParentTypes['DeleteNodeMutationSuccess']
> = {
  nodeId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type DeleteNodeMutationErrorResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['DeleteNodeMutationError'] = ResolversParentTypes['DeleteNodeMutationError']
> = {
  type?: Resolver<Maybe<ResolversTypes['DeleteNodeMutationErrorType']>, ParentType, ContextType>
  details?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PageResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['Page'] = ResolversParentTypes['Page']
> = {
  __resolveType: TypeResolveFn<'RelPage' | 'SearchPage', ParentType, ContextType>
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  edges?: Resolver<Array<ResolversTypes['PageEdge']>, ParentType, ContextType>
}

export type PageInfoResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']
> = {
  endCursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  startCursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PageEdgeResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['PageEdge'] = ResolversParentTypes['PageEdge']
> = {
  __resolveType: TypeResolveFn<'RelPageEdge' | 'SearchPageEdge', ParentType, ContextType>
  cursor?: Resolver<ResolversTypes['Cursor'], ParentType, ContextType>
}

export type QueryResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  getUserSessionProfile?: Resolver<
    Maybe<ResolversTypes['UserSession']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetUserSessionProfileArgs, never>
  >
  globalSearch?: Resolver<
    ResolversTypes['SearchPage'],
    ParentType,
    ContextType,
    RequireFields<QueryGlobalSearchArgs, 'text' | 'sortBy'>
  >
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'id'>>
}

export interface CursorScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Cursor'], any> {
  name: 'Cursor'
}

export interface AssetRefScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AssetRef'], any> {
  name: 'AssetRef'
}

export type IContentNodeResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['IContentNode'] = ResolversParentTypes['IContentNode']
> = {
  __resolveType: TypeResolveFn<'Profile' | 'Collection' | 'Resource' | 'Subject', ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  icon?: Resolver<Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>
}

export type INodeResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['INode'] = ResolversParentTypes['INode']
> = {
  __resolveType: TypeResolveFn<'Profile' | 'Collection' | 'Resource' | 'Subject', ParentType, ContextType>
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>
  _lastEdited?: Resolver<Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<INode_RelArgs, 'edge'>>
  _relCount?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<INode_RelCountArgs, 'type' | 'target'>
  >
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
}

export type IEdgeResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['IEdge'] = ResolversParentTypes['IEdge']
> = {
  __resolveType: TypeResolveFn<'AppliesTo' | 'Contains' | 'Created' | 'Follows' | 'Likes', ParentType, ContextType>
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>
  _lastEdited?: Resolver<Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
}

export type AppliesToResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['AppliesTo'] = ResolversParentTypes['AppliesTo']
> = {
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>
  _lastEdited?: Resolver<Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type EdgeResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['Edge'] = ResolversParentTypes['Edge']
> = {
  __resolveType: TypeResolveFn<'AppliesTo' | 'Contains' | 'Created' | 'Follows' | 'Likes', ParentType, ContextType>
}

export type ContainsResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['Contains'] = ResolversParentTypes['Contains']
> = {
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>
  _lastEdited?: Resolver<Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type CreatedResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['Created'] = ResolversParentTypes['Created']
> = {
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>
  _lastEdited?: Resolver<Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type FollowsResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['Follows'] = ResolversParentTypes['Follows']
> = {
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>
  _lastEdited?: Resolver<Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type LikesResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['Likes'] = ResolversParentTypes['Likes']
> = {
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>
  _lastEdited?: Resolver<Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type GlyphByAtResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['GlyphByAt'] = ResolversParentTypes['GlyphByAt']
> = {
  by?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>
  at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProfileResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['Profile'] = ResolversParentTypes['Profile']
> = {
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>
  _lastEdited?: Resolver<Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Profile_RelArgs, 'edge'>>
  _relCount?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<Profile_RelCountArgs, 'type' | 'target'>
  >
  icon?: Resolver<Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type CollectionResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['Collection'] = ResolversParentTypes['Collection']
> = {
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>
  _lastEdited?: Resolver<Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Collection_RelArgs, 'edge'>>
  _relCount?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<Collection_RelCountArgs, 'type' | 'target'>
  >
  icon?: Resolver<Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ResourceResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['Resource'] = ResolversParentTypes['Resource']
> = {
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>
  _lastEdited?: Resolver<Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Resource_RelArgs, 'edge'>>
  _relCount?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<Resource_RelCountArgs, 'type' | 'target'>
  >
  icon?: Resolver<Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SubjectResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['Subject'] = ResolversParentTypes['Subject']
> = {
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>
  _lastEdited?: Resolver<Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Subject_RelArgs, 'edge'>>
  _relCount?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<Subject_RelCountArgs, 'type' | 'target'>
  >
  icon?: Resolver<Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type RelPageResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['RelPage'] = ResolversParentTypes['RelPage']
> = {
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  edges?: Resolver<Array<ResolversTypes['RelPageEdge']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type RelPageEdgeResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['RelPageEdge'] = ResolversParentTypes['RelPageEdge']
> = {
  cursor?: Resolver<ResolversTypes['Cursor'], ParentType, ContextType>
  edge?: Resolver<ResolversTypes['IEdge'], ParentType, ContextType>
  node?: Resolver<ResolversTypes['INode'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UserSessionResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['UserSession'] = ResolversParentTypes['UserSession']
> = {
  profile?: Resolver<Maybe<ResolversTypes['Profile']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type NodeResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']
> = {
  __resolveType: TypeResolveFn<'Collection' | 'Profile' | 'Resource' | 'Subject', ParentType, ContextType>
}

export type SearchPageResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['SearchPage'] = ResolversParentTypes['SearchPage']
> = {
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  edges?: Resolver<Array<ResolversTypes['SearchPageEdge']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SearchPageEdgeResolvers<
  ContextType = MoodleNetExecutionContext,
  ParentType extends ResolversParentTypes['SearchPageEdge'] = ResolversParentTypes['SearchPageEdge']
> = {
  cursor?: Resolver<ResolversTypes['Cursor'], ParentType, ContextType>
  node?: Resolver<ResolversTypes['IContentNode'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type Resolvers<ContextType = MoodleNetExecutionContext> = {
  Never?: GraphQLScalarType
  Empty?: GraphQLScalarType
  DateTime?: GraphQLScalarType
  Mutation?: MutationResolvers<ContextType>
  CreateNodeMutationPayload?: CreateNodeMutationPayloadResolvers<ContextType>
  CreateNodeMutationSuccess?: CreateNodeMutationSuccessResolvers<ContextType>
  CreateNodeMutationError?: CreateNodeMutationErrorResolvers<ContextType>
  CreateEdgeMutationPayload?: CreateEdgeMutationPayloadResolvers<ContextType>
  CreateEdgeMutationSuccess?: CreateEdgeMutationSuccessResolvers<ContextType>
  CreateEdgeMutationError?: CreateEdgeMutationErrorResolvers<ContextType>
  UpdateNodeMutationPayload?: UpdateNodeMutationPayloadResolvers<ContextType>
  UpdateNodeMutationSuccess?: UpdateNodeMutationSuccessResolvers<ContextType>
  UpdateNodeMutationError?: UpdateNodeMutationErrorResolvers<ContextType>
  UpdateEdgeMutationPayload?: UpdateEdgeMutationPayloadResolvers<ContextType>
  UpdateEdgeMutationSuccess?: UpdateEdgeMutationSuccessResolvers<ContextType>
  UpdateEdgeMutationError?: UpdateEdgeMutationErrorResolvers<ContextType>
  DeleteEdgeMutationPayload?: DeleteEdgeMutationPayloadResolvers<ContextType>
  DeleteEdgeMutationSuccess?: DeleteEdgeMutationSuccessResolvers<ContextType>
  DeleteEdgeMutationError?: DeleteEdgeMutationErrorResolvers<ContextType>
  DeleteNodeMutationPayload?: DeleteNodeMutationPayloadResolvers<ContextType>
  DeleteNodeMutationSuccess?: DeleteNodeMutationSuccessResolvers<ContextType>
  DeleteNodeMutationError?: DeleteNodeMutationErrorResolvers<ContextType>
  Page?: PageResolvers<ContextType>
  PageInfo?: PageInfoResolvers<ContextType>
  PageEdge?: PageEdgeResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  Cursor?: GraphQLScalarType
  AssetRef?: GraphQLScalarType
  IContentNode?: IContentNodeResolvers<ContextType>
  INode?: INodeResolvers<ContextType>
  IEdge?: IEdgeResolvers<ContextType>
  AppliesTo?: AppliesToResolvers<ContextType>
  Edge?: EdgeResolvers<ContextType>
  Contains?: ContainsResolvers<ContextType>
  Created?: CreatedResolvers<ContextType>
  Follows?: FollowsResolvers<ContextType>
  Likes?: LikesResolvers<ContextType>
  GlyphByAt?: GlyphByAtResolvers<ContextType>
  Profile?: ProfileResolvers<ContextType>
  Collection?: CollectionResolvers<ContextType>
  Resource?: ResourceResolvers<ContextType>
  Subject?: SubjectResolvers<ContextType>
  RelPage?: RelPageResolvers<ContextType>
  RelPageEdge?: RelPageEdgeResolvers<ContextType>
  UserSession?: UserSessionResolvers<ContextType>
  Node?: NodeResolvers<ContextType>
  SearchPage?: SearchPageResolvers<ContextType>
  SearchPageEdge?: SearchPageEdgeResolvers<ContextType>
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = MoodleNetExecutionContext> = Resolvers<ContextType>
