import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql';
import { AssetRef } from '@moodlenet/common/lib/graphql/scalars.graphql';
import { Cursor } from '@moodlenet/common/lib/graphql/scalars.graphql';
import { DateTime } from '@moodlenet/common/lib/graphql/scalars.graphql';
import { Empty } from '@moodlenet/common/lib/graphql/scalars.graphql';
import { Never } from '@moodlenet/common/lib/graphql/scalars.graphql';
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { MoodleNetExecutionContext, RootValue } from './types';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: ID;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AssetRef: AssetRef;
  Cursor: Cursor;
  DateTime: DateTime;
  Empty: Empty;
  Never: Never;
};

export type AppliesTo = IEdge & {
  __typename: 'AppliesTo';
  _created: GlyphByAt;
  _lastEdited?: Maybe<GlyphByAt>;
  id: Scalars['ID'];
};


export type AssetRefInput = {
  type: AssetRefInputType;
  location: Scalars['String'];
};

export type AssetRefInputType =
  | 'TmpUpload'
  | 'ExternalUrl'
  | 'NoChange'
  | 'NoAsset';

export type Collection = IContentNode & INode & {
  __typename: 'Collection';
  _created: GlyphByAt;
  _lastEdited?: Maybe<GlyphByAt>;
  _rel: RelPage;
  _relCount: Scalars['Int'];
  icon?: Maybe<Scalars['AssetRef']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  summary: Scalars['String'];
};


export type Collection_RelArgs = {
  edge: EdgeTypeInput;
  page?: Maybe<PaginationInput>;
};


export type Collection_RelCountArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
};

export type ConnAssertion =
  | 'NoExistingSameEdgeTypeInSameDirectionBetweenTheSameTwoNodes'
  | 'NoExistingSameEdgeTypeToThisNode';

export type Contains = IEdge & {
  __typename: 'Contains';
  _created: GlyphByAt;
  _lastEdited?: Maybe<GlyphByAt>;
  id: Scalars['ID'];
};

export type ContentNodeInput = {
  name: Scalars['String'];
  summary: Scalars['String'];
  icon: AssetRefInput;
};

export type CreateCollectionInput = {
  content: ContentNodeInput;
};

export type CreateEdgeInput = {
  AppliesTo?: Maybe<Scalars['Empty']>;
  Contains?: Maybe<Scalars['Empty']>;
  Created?: Maybe<Scalars['Empty']>;
  Follows?: Maybe<Scalars['Empty']>;
  Likes?: Maybe<Scalars['Empty']>;
  edgeType: EdgeType;
  from: Scalars['ID'];
  to: Scalars['ID'];
};

export type CreateEdgeMutationError = {
  __typename: 'CreateEdgeMutationError';
  type: CreateEdgeMutationErrorType;
  details?: Maybe<Scalars['String']>;
};

export type CreateEdgeMutationErrorType =
  | 'NotAuthorized'
  | 'NotAllowed'
  | 'AssertionFailed'
  | 'NoSelfReference'
  | 'UnexpectedInput';

export type CreateEdgeMutationPayload = CreateEdgeMutationSuccess | CreateEdgeMutationError;

export type CreateEdgeMutationSuccess = {
  __typename: 'CreateEdgeMutationSuccess';
  edge: Edge;
};

export type CreateNodeInput = {
  Collection?: Maybe<CreateCollectionInput>;
  Profile?: Maybe<CreateProfileInput>;
  Resource?: Maybe<CreateResourceInput>;
  Subject?: Maybe<CreateSubjectInput>;
  nodeType: NodeType;
};

export type CreateNodeMutationError = {
  __typename: 'CreateNodeMutationError';
  type: CreateNodeMutationErrorType;
  details?: Maybe<Scalars['String']>;
};

export type CreateNodeMutationErrorType =
  | 'NotAuthorized'
  | 'UnexpectedInput'
  | 'AssertionFailed';

export type CreateNodeMutationPayload = CreateNodeMutationSuccess | CreateNodeMutationError;

export type CreateNodeMutationSuccess = {
  __typename: 'CreateNodeMutationSuccess';
  node: Node;
};

export type CreateProfileInput = {
  content: ContentNodeInput;
};

export type CreateResourceInput = {
  content: ContentNodeInput;
  resource: AssetRefInput;
};

export type CreateSubjectInput = {
  content: ContentNodeInput;
};

export type Created = IEdge & {
  __typename: 'Created';
  _created: GlyphByAt;
  _lastEdited?: Maybe<GlyphByAt>;
  id: Scalars['ID'];
};

export type CtxAssertion =
  | 'ExecutorIsAuthenticated'
  | 'ExecutorIsSystem'
  | 'ExecutorIsAdmin'
  | 'ExecutorIsAnonymous';



export type DeleteEdgeInput = {
  id: Scalars['ID'];
  edgeType: EdgeType;
};

export type DeleteEdgeMutationError = {
  __typename: 'DeleteEdgeMutationError';
  type?: Maybe<DeleteEdgeMutationErrorType>;
  details?: Maybe<Scalars['String']>;
};

export type DeleteEdgeMutationErrorType =
  | 'NotFound'
  | 'NotAuthorized'
  | 'UnexpectedInput'
  | 'AssertionFailed';

export type DeleteEdgeMutationPayload = DeleteEdgeMutationSuccess | DeleteEdgeMutationError;

export type DeleteEdgeMutationSuccess = {
  __typename: 'DeleteEdgeMutationSuccess';
  edgeId?: Maybe<Scalars['ID']>;
};

export type DeleteNodeInput = {
  id: Scalars['ID'];
  nodeType: NodeType;
};

export type DeleteNodeMutationError = {
  __typename: 'DeleteNodeMutationError';
  type?: Maybe<DeleteNodeMutationErrorType>;
  details?: Maybe<Scalars['String']>;
};

export type DeleteNodeMutationErrorType =
  | 'NotFound'
  | 'NotAuthorized'
  | 'AssertionFailed';

export type DeleteNodeMutationPayload = DeleteNodeMutationSuccess | DeleteNodeMutationError;

export type DeleteNodeMutationSuccess = {
  __typename: 'DeleteNodeMutationSuccess';
  nodeId?: Maybe<Scalars['ID']>;
};

export type Edge = AppliesTo | Contains | Created | Follows | Likes;

export type EdgeType =
  | 'AppliesTo'
  | 'Contains'
  | 'Created'
  | 'Follows'
  | 'Likes';

export type EdgeTypeInput = {
  type: EdgeType;
  node: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
  targetMe?: Maybe<Scalars['Boolean']>;
  targetIDs?: Maybe<Array<Scalars['ID']>>;
};


export type Follows = IEdge & {
  __typename: 'Follows';
  _created: GlyphByAt;
  _lastEdited?: Maybe<GlyphByAt>;
  id: Scalars['ID'];
};

export type GlobalSearchSort =
  | 'Relevance'
  | 'Popularity';

export type GlyphByAt = {
  __typename: 'GlyphByAt';
  by: Profile;
  at: Scalars['DateTime'];
};

export type IContentNode = {
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['AssetRef']>;
};

export type IEdge = {
  _created: GlyphByAt;
  _lastEdited?: Maybe<GlyphByAt>;
  id?: Maybe<Scalars['ID']>;
};

export type INode = {
  _created: GlyphByAt;
  _lastEdited?: Maybe<GlyphByAt>;
  _rel: RelPage;
  _relCount: Scalars['Int'];
  id: Scalars['ID'];
};


export type INode_RelArgs = {
  edge: EdgeTypeInput;
  page?: Maybe<PaginationInput>;
};


export type INode_RelCountArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
};

export type Likes = IEdge & {
  __typename: 'Likes';
  _created: GlyphByAt;
  _lastEdited?: Maybe<GlyphByAt>;
  id: Scalars['ID'];
};


export type Node = Collection | Profile | Resource | Subject;

export type NodeAssertion =
  | 'ExecutorCreatedThisNode'
  | 'ThisNodeIsExecutorProfile';

export type NodeType =
  | 'Collection'
  | 'Profile'
  | 'Resource'
  | 'Subject';

export type Page = {
  pageInfo: PageInfo;
  edges: Array<RelPageEdge | SearchPageEdge>;
};

export type PageEdge = {
  cursor: Scalars['Cursor'];
};

export type PageInfo = {
  __typename: 'PageInfo';
  endCursor?: Maybe<Scalars['Cursor']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['Cursor']>;
};

export type PaginationInput = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
};

export type Profile = IContentNode & INode & {
  __typename: 'Profile';
  _created: GlyphByAt;
  _lastEdited?: Maybe<GlyphByAt>;
  _rel: RelPage;
  _relCount: Scalars['Int'];
  icon?: Maybe<Scalars['AssetRef']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  summary: Scalars['String'];
};


export type Profile_RelArgs = {
  edge: EdgeTypeInput;
  page?: Maybe<PaginationInput>;
};


export type Profile_RelCountArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
};

export type Query = {
  __typename: 'Query';
  node?: Maybe<Node>;
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
};

export type RelPage = Page & {
  __typename: 'RelPage';
  pageInfo: PageInfo;
  edges: Array<RelPageEdge>;
};

export type RelPageEdge = PageEdge & {
  __typename: 'RelPageEdge';
  cursor: Scalars['Cursor'];
  edge: AppliesTo | Contains | Created | Follows | Likes;
  node: Collection | Profile | Resource | Subject;
};

export type Resource = IContentNode & INode & {
  __typename: 'Resource';
  _created: GlyphByAt;
  _lastEdited?: Maybe<GlyphByAt>;
  _rel: RelPage;
  _relCount: Scalars['Int'];
  icon?: Maybe<Scalars['AssetRef']>;
  id: Scalars['ID'];
  location: Scalars['AssetRef'];
  name: Scalars['String'];
  summary: Scalars['String'];
};


export type Resource_RelArgs = {
  edge: EdgeTypeInput;
  page?: Maybe<PaginationInput>;
};


export type Resource_RelCountArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
};

export type SearchPage = Page & {
  __typename: 'SearchPage';
  pageInfo: PageInfo;
  edges: Array<SearchPageEdge>;
};

export type SearchPageEdge = PageEdge & {
  __typename: 'SearchPageEdge';
  cursor: Scalars['Cursor'];
  node: Collection | Profile | Resource | Subject;
};

export type Subject = IContentNode & INode & {
  __typename: 'Subject';
  _created: GlyphByAt;
  _lastEdited?: Maybe<GlyphByAt>;
  _rel: RelPage;
  _relCount: Scalars['Int'];
  icon?: Maybe<Scalars['AssetRef']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  summary: Scalars['String'];
};


export type Subject_RelArgs = {
  edge: EdgeTypeInput;
  page?: Maybe<PaginationInput>;
};


export type Subject_RelCountArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
};

export type UpdateCollectionInput = {
  content: ContentNodeInput;
};

export type UpdateEdgeInput = {
  AppliesTo?: Maybe<Scalars['Empty']>;
  Contains?: Maybe<Scalars['Empty']>;
  Created?: Maybe<Scalars['Empty']>;
  Follows?: Maybe<Scalars['Empty']>;
  Likes?: Maybe<Scalars['Empty']>;
  edgeType: EdgeType;
  id: Scalars['ID'];
};

export type UpdateEdgeMutationError = {
  __typename: 'UpdateEdgeMutationError';
  type: UpdateEdgeMutationErrorType;
  details?: Maybe<Scalars['String']>;
};

export type UpdateEdgeMutationErrorType =
  | 'NotFound'
  | 'NotAuthorized'
  | 'UnexpectedInput'
  | 'AssertionFailed';

export type UpdateEdgeMutationPayload = UpdateEdgeMutationSuccess | UpdateEdgeMutationError;

export type UpdateEdgeMutationSuccess = {
  __typename: 'UpdateEdgeMutationSuccess';
  edge?: Maybe<Edge>;
};

export type UpdateNodeInput = {
  Collection?: Maybe<UpdateCollectionInput>;
  Profile?: Maybe<UpdateProfileInput>;
  Resource?: Maybe<UpdateResourceInput>;
  Subject?: Maybe<UpdateSubjectInput>;
  id: Scalars['ID'];
  nodeType: NodeType;
};

export type UpdateNodeMutationError = {
  __typename: 'UpdateNodeMutationError';
  type: UpdateNodeMutationErrorType;
  details?: Maybe<Scalars['String']>;
};

export type UpdateNodeMutationErrorType =
  | 'NotFound'
  | 'NotAuthorized'
  | 'UnexpectedInput'
  | 'AssertionFailed';

export type UpdateNodeMutationPayload = UpdateNodeMutationSuccess | UpdateNodeMutationError;

export type UpdateNodeMutationSuccess = {
  __typename: 'UpdateNodeMutationSuccess';
  node?: Maybe<Node>;
};

export type UpdateProfileInput = {
  content: ContentNodeInput;
};

export type UpdateResourceInput = {
  content: ContentNodeInput;
};

export type UpdateSubjectInput = {
  content: ContentNodeInput;
};

export type UserSession = {
  __typename: 'UserSession';
  profile?: Maybe<Profile>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AppliesTo: ResolverTypeWrapper<AppliesTo>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  AssetRef: ResolverTypeWrapper<Scalars['AssetRef']>;
  AssetRefInput: AssetRefInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  AssetRefInputType: AssetRefInputType;
  Collection: ResolverTypeWrapper<Collection>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  ConnAssertion: ConnAssertion;
  Contains: ResolverTypeWrapper<Contains>;
  ContentNodeInput: ContentNodeInput;
  CreateCollectionInput: CreateCollectionInput;
  CreateEdgeInput: CreateEdgeInput;
  CreateEdgeMutationError: ResolverTypeWrapper<CreateEdgeMutationError>;
  CreateEdgeMutationErrorType: CreateEdgeMutationErrorType;
  CreateEdgeMutationPayload: ResolversTypes['CreateEdgeMutationSuccess'] | ResolversTypes['CreateEdgeMutationError'];
  CreateEdgeMutationSuccess: ResolverTypeWrapper<Omit<CreateEdgeMutationSuccess, 'edge'> & { edge: ResolversTypes['Edge'] }>;
  CreateNodeInput: CreateNodeInput;
  CreateNodeMutationError: ResolverTypeWrapper<CreateNodeMutationError>;
  CreateNodeMutationErrorType: CreateNodeMutationErrorType;
  CreateNodeMutationPayload: ResolversTypes['CreateNodeMutationSuccess'] | ResolversTypes['CreateNodeMutationError'];
  CreateNodeMutationSuccess: ResolverTypeWrapper<Omit<CreateNodeMutationSuccess, 'node'> & { node: ResolversTypes['Node'] }>;
  CreateProfileInput: CreateProfileInput;
  CreateResourceInput: CreateResourceInput;
  CreateSubjectInput: CreateSubjectInput;
  Created: ResolverTypeWrapper<Created>;
  CtxAssertion: CtxAssertion;
  Cursor: ResolverTypeWrapper<Scalars['Cursor']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  DeleteEdgeInput: DeleteEdgeInput;
  DeleteEdgeMutationError: ResolverTypeWrapper<DeleteEdgeMutationError>;
  DeleteEdgeMutationErrorType: DeleteEdgeMutationErrorType;
  DeleteEdgeMutationPayload: ResolversTypes['DeleteEdgeMutationSuccess'] | ResolversTypes['DeleteEdgeMutationError'];
  DeleteEdgeMutationSuccess: ResolverTypeWrapper<DeleteEdgeMutationSuccess>;
  DeleteNodeInput: DeleteNodeInput;
  DeleteNodeMutationError: ResolverTypeWrapper<DeleteNodeMutationError>;
  DeleteNodeMutationErrorType: DeleteNodeMutationErrorType;
  DeleteNodeMutationPayload: ResolversTypes['DeleteNodeMutationSuccess'] | ResolversTypes['DeleteNodeMutationError'];
  DeleteNodeMutationSuccess: ResolverTypeWrapper<DeleteNodeMutationSuccess>;
  Edge: ResolversTypes['AppliesTo'] | ResolversTypes['Contains'] | ResolversTypes['Created'] | ResolversTypes['Follows'] | ResolversTypes['Likes'];
  EdgeType: EdgeType;
  EdgeTypeInput: EdgeTypeInput;
  Empty: ResolverTypeWrapper<Scalars['Empty']>;
  Follows: ResolverTypeWrapper<Follows>;
  GlobalSearchSort: GlobalSearchSort;
  GlyphByAt: ResolverTypeWrapper<GlyphByAt>;
  IContentNode: ResolversTypes['Collection'] | ResolversTypes['Profile'] | ResolversTypes['Resource'] | ResolversTypes['Subject'];
  IEdge: ResolversTypes['AppliesTo'] | ResolversTypes['Contains'] | ResolversTypes['Created'] | ResolversTypes['Follows'] | ResolversTypes['Likes'];
  INode: ResolversTypes['Collection'] | ResolversTypes['Profile'] | ResolversTypes['Resource'] | ResolversTypes['Subject'];
  Likes: ResolverTypeWrapper<Likes>;
  Never: ResolverTypeWrapper<Scalars['Never']>;
  Node: ResolversTypes['Collection'] | ResolversTypes['Profile'] | ResolversTypes['Resource'] | ResolversTypes['Subject'];
  NodeAssertion: NodeAssertion;
  NodeType: NodeType;
  Page: ResolversTypes['RelPage'] | ResolversTypes['SearchPage'];
  PageEdge: ResolversTypes['RelPageEdge'] | ResolversTypes['SearchPageEdge'];
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PaginationInput: PaginationInput;
  Profile: ResolverTypeWrapper<Profile>;
  Query: ResolverTypeWrapper<RootValue>;
  RelPage: ResolverTypeWrapper<RelPage>;
  RelPageEdge: ResolverTypeWrapper<RelPageEdge>;
  Resource: ResolverTypeWrapper<Resource>;
  SearchPage: ResolverTypeWrapper<SearchPage>;
  SearchPageEdge: ResolverTypeWrapper<SearchPageEdge>;
  Subject: ResolverTypeWrapper<Subject>;
  UpdateCollectionInput: UpdateCollectionInput;
  UpdateEdgeInput: UpdateEdgeInput;
  UpdateEdgeMutationError: ResolverTypeWrapper<UpdateEdgeMutationError>;
  UpdateEdgeMutationErrorType: UpdateEdgeMutationErrorType;
  UpdateEdgeMutationPayload: ResolversTypes['UpdateEdgeMutationSuccess'] | ResolversTypes['UpdateEdgeMutationError'];
  UpdateEdgeMutationSuccess: ResolverTypeWrapper<Omit<UpdateEdgeMutationSuccess, 'edge'> & { edge?: Maybe<ResolversTypes['Edge']> }>;
  UpdateNodeInput: UpdateNodeInput;
  UpdateNodeMutationError: ResolverTypeWrapper<UpdateNodeMutationError>;
  UpdateNodeMutationErrorType: UpdateNodeMutationErrorType;
  UpdateNodeMutationPayload: ResolversTypes['UpdateNodeMutationSuccess'] | ResolversTypes['UpdateNodeMutationError'];
  UpdateNodeMutationSuccess: ResolverTypeWrapper<Omit<UpdateNodeMutationSuccess, 'node'> & { node?: Maybe<ResolversTypes['Node']> }>;
  UpdateProfileInput: UpdateProfileInput;
  UpdateResourceInput: UpdateResourceInput;
  UpdateSubjectInput: UpdateSubjectInput;
  UserSession: ResolverTypeWrapper<UserSession>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AppliesTo: AppliesTo;
  ID: Scalars['ID'];
  AssetRef: Scalars['AssetRef'];
  AssetRefInput: AssetRefInput;
  String: Scalars['String'];
  Collection: Collection;
  Int: Scalars['Int'];
  Boolean: Scalars['Boolean'];
  Contains: Contains;
  ContentNodeInput: ContentNodeInput;
  CreateCollectionInput: CreateCollectionInput;
  CreateEdgeInput: CreateEdgeInput;
  CreateEdgeMutationError: CreateEdgeMutationError;
  CreateEdgeMutationPayload: ResolversParentTypes['CreateEdgeMutationSuccess'] | ResolversParentTypes['CreateEdgeMutationError'];
  CreateEdgeMutationSuccess: Omit<CreateEdgeMutationSuccess, 'edge'> & { edge: ResolversParentTypes['Edge'] };
  CreateNodeInput: CreateNodeInput;
  CreateNodeMutationError: CreateNodeMutationError;
  CreateNodeMutationPayload: ResolversParentTypes['CreateNodeMutationSuccess'] | ResolversParentTypes['CreateNodeMutationError'];
  CreateNodeMutationSuccess: Omit<CreateNodeMutationSuccess, 'node'> & { node: ResolversParentTypes['Node'] };
  CreateProfileInput: CreateProfileInput;
  CreateResourceInput: CreateResourceInput;
  CreateSubjectInput: CreateSubjectInput;
  Created: Created;
  Cursor: Scalars['Cursor'];
  DateTime: Scalars['DateTime'];
  DeleteEdgeInput: DeleteEdgeInput;
  DeleteEdgeMutationError: DeleteEdgeMutationError;
  DeleteEdgeMutationPayload: ResolversParentTypes['DeleteEdgeMutationSuccess'] | ResolversParentTypes['DeleteEdgeMutationError'];
  DeleteEdgeMutationSuccess: DeleteEdgeMutationSuccess;
  DeleteNodeInput: DeleteNodeInput;
  DeleteNodeMutationError: DeleteNodeMutationError;
  DeleteNodeMutationPayload: ResolversParentTypes['DeleteNodeMutationSuccess'] | ResolversParentTypes['DeleteNodeMutationError'];
  DeleteNodeMutationSuccess: DeleteNodeMutationSuccess;
  Edge: ResolversParentTypes['AppliesTo'] | ResolversParentTypes['Contains'] | ResolversParentTypes['Created'] | ResolversParentTypes['Follows'] | ResolversParentTypes['Likes'];
  EdgeTypeInput: EdgeTypeInput;
  Empty: Scalars['Empty'];
  Follows: Follows;
  GlyphByAt: GlyphByAt;
  IContentNode: ResolversParentTypes['Collection'] | ResolversParentTypes['Profile'] | ResolversParentTypes['Resource'] | ResolversParentTypes['Subject'];
  IEdge: ResolversParentTypes['AppliesTo'] | ResolversParentTypes['Contains'] | ResolversParentTypes['Created'] | ResolversParentTypes['Follows'] | ResolversParentTypes['Likes'];
  INode: ResolversParentTypes['Collection'] | ResolversParentTypes['Profile'] | ResolversParentTypes['Resource'] | ResolversParentTypes['Subject'];
  Likes: Likes;
  Never: Scalars['Never'];
  Node: ResolversParentTypes['Collection'] | ResolversParentTypes['Profile'] | ResolversParentTypes['Resource'] | ResolversParentTypes['Subject'];
  Page: ResolversParentTypes['RelPage'] | ResolversParentTypes['SearchPage'];
  PageEdge: ResolversParentTypes['RelPageEdge'] | ResolversParentTypes['SearchPageEdge'];
  PageInfo: PageInfo;
  PaginationInput: PaginationInput;
  Profile: Profile;
  Query: RootValue;
  RelPage: RelPage;
  RelPageEdge: RelPageEdge;
  Resource: Resource;
  SearchPage: SearchPage;
  SearchPageEdge: SearchPageEdge;
  Subject: Subject;
  UpdateCollectionInput: UpdateCollectionInput;
  UpdateEdgeInput: UpdateEdgeInput;
  UpdateEdgeMutationError: UpdateEdgeMutationError;
  UpdateEdgeMutationPayload: ResolversParentTypes['UpdateEdgeMutationSuccess'] | ResolversParentTypes['UpdateEdgeMutationError'];
  UpdateEdgeMutationSuccess: Omit<UpdateEdgeMutationSuccess, 'edge'> & { edge?: Maybe<ResolversParentTypes['Edge']> };
  UpdateNodeInput: UpdateNodeInput;
  UpdateNodeMutationError: UpdateNodeMutationError;
  UpdateNodeMutationPayload: ResolversParentTypes['UpdateNodeMutationSuccess'] | ResolversParentTypes['UpdateNodeMutationError'];
  UpdateNodeMutationSuccess: Omit<UpdateNodeMutationSuccess, 'node'> & { node?: Maybe<ResolversParentTypes['Node']> };
  UpdateProfileInput: UpdateProfileInput;
  UpdateResourceInput: UpdateResourceInput;
  UpdateSubjectInput: UpdateSubjectInput;
  UserSession: UserSession;
};

export type AppliesToResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['AppliesTo'] = ResolversParentTypes['AppliesTo']> = {
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>;
  _lastEdited?: Resolver<Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface AssetRefScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AssetRef'], any> {
  name: 'AssetRef';
}

export type CollectionResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Collection'] = ResolversParentTypes['Collection']> = {
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>;
  _lastEdited?: Resolver<Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Collection_RelArgs, 'edge'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Collection_RelCountArgs, 'type' | 'target'>>;
  icon?: Resolver<Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContainsResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Contains'] = ResolversParentTypes['Contains']> = {
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>;
  _lastEdited?: Resolver<Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateEdgeMutationErrorResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['CreateEdgeMutationError'] = ResolversParentTypes['CreateEdgeMutationError']> = {
  type?: Resolver<ResolversTypes['CreateEdgeMutationErrorType'], ParentType, ContextType>;
  details?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateEdgeMutationPayloadResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['CreateEdgeMutationPayload'] = ResolversParentTypes['CreateEdgeMutationPayload']> = {
  __resolveType: TypeResolveFn<'CreateEdgeMutationSuccess' | 'CreateEdgeMutationError', ParentType, ContextType>;
};

export type CreateEdgeMutationSuccessResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['CreateEdgeMutationSuccess'] = ResolversParentTypes['CreateEdgeMutationSuccess']> = {
  edge?: Resolver<ResolversTypes['Edge'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateNodeMutationErrorResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['CreateNodeMutationError'] = ResolversParentTypes['CreateNodeMutationError']> = {
  type?: Resolver<ResolversTypes['CreateNodeMutationErrorType'], ParentType, ContextType>;
  details?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateNodeMutationPayloadResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['CreateNodeMutationPayload'] = ResolversParentTypes['CreateNodeMutationPayload']> = {
  __resolveType: TypeResolveFn<'CreateNodeMutationSuccess' | 'CreateNodeMutationError', ParentType, ContextType>;
};

export type CreateNodeMutationSuccessResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['CreateNodeMutationSuccess'] = ResolversParentTypes['CreateNodeMutationSuccess']> = {
  node?: Resolver<ResolversTypes['Node'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreatedResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Created'] = ResolversParentTypes['Created']> = {
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>;
  _lastEdited?: Resolver<Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface CursorScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Cursor'], any> {
  name: 'Cursor';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DeleteEdgeMutationErrorResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['DeleteEdgeMutationError'] = ResolversParentTypes['DeleteEdgeMutationError']> = {
  type?: Resolver<Maybe<ResolversTypes['DeleteEdgeMutationErrorType']>, ParentType, ContextType>;
  details?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteEdgeMutationPayloadResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['DeleteEdgeMutationPayload'] = ResolversParentTypes['DeleteEdgeMutationPayload']> = {
  __resolveType: TypeResolveFn<'DeleteEdgeMutationSuccess' | 'DeleteEdgeMutationError', ParentType, ContextType>;
};

export type DeleteEdgeMutationSuccessResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['DeleteEdgeMutationSuccess'] = ResolversParentTypes['DeleteEdgeMutationSuccess']> = {
  edgeId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteNodeMutationErrorResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['DeleteNodeMutationError'] = ResolversParentTypes['DeleteNodeMutationError']> = {
  type?: Resolver<Maybe<ResolversTypes['DeleteNodeMutationErrorType']>, ParentType, ContextType>;
  details?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteNodeMutationPayloadResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['DeleteNodeMutationPayload'] = ResolversParentTypes['DeleteNodeMutationPayload']> = {
  __resolveType: TypeResolveFn<'DeleteNodeMutationSuccess' | 'DeleteNodeMutationError', ParentType, ContextType>;
};

export type DeleteNodeMutationSuccessResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['DeleteNodeMutationSuccess'] = ResolversParentTypes['DeleteNodeMutationSuccess']> = {
  nodeId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EdgeResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Edge'] = ResolversParentTypes['Edge']> = {
  __resolveType: TypeResolveFn<'AppliesTo' | 'Contains' | 'Created' | 'Follows' | 'Likes', ParentType, ContextType>;
};

export interface EmptyScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Empty'], any> {
  name: 'Empty';
}

export type FollowsResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Follows'] = ResolversParentTypes['Follows']> = {
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>;
  _lastEdited?: Resolver<Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GlyphByAtResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['GlyphByAt'] = ResolversParentTypes['GlyphByAt']> = {
  by?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IContentNodeResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['IContentNode'] = ResolversParentTypes['IContentNode']> = {
  __resolveType: TypeResolveFn<'Collection' | 'Profile' | 'Resource' | 'Subject', ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>;
};

export type IEdgeResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['IEdge'] = ResolversParentTypes['IEdge']> = {
  __resolveType: TypeResolveFn<'AppliesTo' | 'Contains' | 'Created' | 'Follows' | 'Likes', ParentType, ContextType>;
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>;
  _lastEdited?: Resolver<Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
};

export type INodeResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['INode'] = ResolversParentTypes['INode']> = {
  __resolveType: TypeResolveFn<'Collection' | 'Profile' | 'Resource' | 'Subject', ParentType, ContextType>;
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>;
  _lastEdited?: Resolver<Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<INode_RelArgs, 'edge'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<INode_RelCountArgs, 'type' | 'target'>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type LikesResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Likes'] = ResolversParentTypes['Likes']> = {
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>;
  _lastEdited?: Resolver<Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface NeverScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Never'], any> {
  name: 'Never';
}

export type NodeResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'Collection' | 'Profile' | 'Resource' | 'Subject', ParentType, ContextType>;
};

export type PageResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Page'] = ResolversParentTypes['Page']> = {
  __resolveType: TypeResolveFn<'RelPage' | 'SearchPage', ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['PageEdge']>, ParentType, ContextType>;
};

export type PageEdgeResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['PageEdge'] = ResolversParentTypes['PageEdge']> = {
  __resolveType: TypeResolveFn<'RelPageEdge' | 'SearchPageEdge', ParentType, ContextType>;
  cursor?: Resolver<ResolversTypes['Cursor'], ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProfileResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Profile'] = ResolversParentTypes['Profile']> = {
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>;
  _lastEdited?: Resolver<Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Profile_RelArgs, 'edge'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Profile_RelCountArgs, 'type' | 'target'>>;
  icon?: Resolver<Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'id'>>;
};

export type RelPageResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['RelPage'] = ResolversParentTypes['RelPage']> = {
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['RelPageEdge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RelPageEdgeResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['RelPageEdge'] = ResolversParentTypes['RelPageEdge']> = {
  cursor?: Resolver<ResolversTypes['Cursor'], ParentType, ContextType>;
  edge?: Resolver<ResolversTypes['IEdge'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['INode'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResourceResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Resource'] = ResolversParentTypes['Resource']> = {
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>;
  _lastEdited?: Resolver<Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Resource_RelArgs, 'edge'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Resource_RelCountArgs, 'type' | 'target'>>;
  icon?: Resolver<Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  location?: Resolver<ResolversTypes['AssetRef'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SearchPageResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['SearchPage'] = ResolversParentTypes['SearchPage']> = {
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['SearchPageEdge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SearchPageEdgeResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['SearchPageEdge'] = ResolversParentTypes['SearchPageEdge']> = {
  cursor?: Resolver<ResolversTypes['Cursor'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['IContentNode'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubjectResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Subject'] = ResolversParentTypes['Subject']> = {
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>;
  _lastEdited?: Resolver<Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Subject_RelArgs, 'edge'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Subject_RelCountArgs, 'type' | 'target'>>;
  icon?: Resolver<Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateEdgeMutationErrorResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['UpdateEdgeMutationError'] = ResolversParentTypes['UpdateEdgeMutationError']> = {
  type?: Resolver<ResolversTypes['UpdateEdgeMutationErrorType'], ParentType, ContextType>;
  details?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateEdgeMutationPayloadResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['UpdateEdgeMutationPayload'] = ResolversParentTypes['UpdateEdgeMutationPayload']> = {
  __resolveType: TypeResolveFn<'UpdateEdgeMutationSuccess' | 'UpdateEdgeMutationError', ParentType, ContextType>;
};

export type UpdateEdgeMutationSuccessResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['UpdateEdgeMutationSuccess'] = ResolversParentTypes['UpdateEdgeMutationSuccess']> = {
  edge?: Resolver<Maybe<ResolversTypes['Edge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateNodeMutationErrorResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['UpdateNodeMutationError'] = ResolversParentTypes['UpdateNodeMutationError']> = {
  type?: Resolver<ResolversTypes['UpdateNodeMutationErrorType'], ParentType, ContextType>;
  details?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateNodeMutationPayloadResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['UpdateNodeMutationPayload'] = ResolversParentTypes['UpdateNodeMutationPayload']> = {
  __resolveType: TypeResolveFn<'UpdateNodeMutationSuccess' | 'UpdateNodeMutationError', ParentType, ContextType>;
};

export type UpdateNodeMutationSuccessResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['UpdateNodeMutationSuccess'] = ResolversParentTypes['UpdateNodeMutationSuccess']> = {
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSessionResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['UserSession'] = ResolversParentTypes['UserSession']> = {
  profile?: Resolver<Maybe<ResolversTypes['Profile']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = MoodleNetExecutionContext> = {
  AppliesTo?: AppliesToResolvers<ContextType>;
  AssetRef?: GraphQLScalarType;
  Collection?: CollectionResolvers<ContextType>;
  Contains?: ContainsResolvers<ContextType>;
  CreateEdgeMutationError?: CreateEdgeMutationErrorResolvers<ContextType>;
  CreateEdgeMutationPayload?: CreateEdgeMutationPayloadResolvers<ContextType>;
  CreateEdgeMutationSuccess?: CreateEdgeMutationSuccessResolvers<ContextType>;
  CreateNodeMutationError?: CreateNodeMutationErrorResolvers<ContextType>;
  CreateNodeMutationPayload?: CreateNodeMutationPayloadResolvers<ContextType>;
  CreateNodeMutationSuccess?: CreateNodeMutationSuccessResolvers<ContextType>;
  Created?: CreatedResolvers<ContextType>;
  Cursor?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  DeleteEdgeMutationError?: DeleteEdgeMutationErrorResolvers<ContextType>;
  DeleteEdgeMutationPayload?: DeleteEdgeMutationPayloadResolvers<ContextType>;
  DeleteEdgeMutationSuccess?: DeleteEdgeMutationSuccessResolvers<ContextType>;
  DeleteNodeMutationError?: DeleteNodeMutationErrorResolvers<ContextType>;
  DeleteNodeMutationPayload?: DeleteNodeMutationPayloadResolvers<ContextType>;
  DeleteNodeMutationSuccess?: DeleteNodeMutationSuccessResolvers<ContextType>;
  Edge?: EdgeResolvers<ContextType>;
  Empty?: GraphQLScalarType;
  Follows?: FollowsResolvers<ContextType>;
  GlyphByAt?: GlyphByAtResolvers<ContextType>;
  IContentNode?: IContentNodeResolvers<ContextType>;
  IEdge?: IEdgeResolvers<ContextType>;
  INode?: INodeResolvers<ContextType>;
  Likes?: LikesResolvers<ContextType>;
  Never?: GraphQLScalarType;
  Node?: NodeResolvers<ContextType>;
  Page?: PageResolvers<ContextType>;
  PageEdge?: PageEdgeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Profile?: ProfileResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RelPage?: RelPageResolvers<ContextType>;
  RelPageEdge?: RelPageEdgeResolvers<ContextType>;
  Resource?: ResourceResolvers<ContextType>;
  SearchPage?: SearchPageResolvers<ContextType>;
  SearchPageEdge?: SearchPageEdgeResolvers<ContextType>;
  Subject?: SubjectResolvers<ContextType>;
  UpdateEdgeMutationError?: UpdateEdgeMutationErrorResolvers<ContextType>;
  UpdateEdgeMutationPayload?: UpdateEdgeMutationPayloadResolvers<ContextType>;
  UpdateEdgeMutationSuccess?: UpdateEdgeMutationSuccessResolvers<ContextType>;
  UpdateNodeMutationError?: UpdateNodeMutationErrorResolvers<ContextType>;
  UpdateNodeMutationPayload?: UpdateNodeMutationPayloadResolvers<ContextType>;
  UpdateNodeMutationSuccess?: UpdateNodeMutationSuccessResolvers<ContextType>;
  UserSession?: UserSessionResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = MoodleNetExecutionContext> = Resolvers<ContextType>;
