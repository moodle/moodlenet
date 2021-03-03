import { Id } from './types';
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { MoodleNetExecutionContext, RootValue } from '../../MoodleNetGraphQL';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: Id;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Never: never;
  Empty: {};
  DateTime: Date;
  Cursor: string;
};




export type Mutation = {
  __typename: 'Mutation';
  createEdge: CreateEdgeMutationPayload;
  createNode: CreateNodeMutationPayload;
  updateEdge: UpdateEdgeMutationPayload;
  updateNode: UpdateNodeMutationPayload;
  deleteEdge: DeleteEdgeMutationPayload;
  deleteNode: DeleteNodeMutationPayload;
};


export type MutationCreateEdgeArgs = {
  input: CreateEdgeInput;
};


export type MutationCreateNodeArgs = {
  input: CreateNodeInput;
};


export type MutationUpdateEdgeArgs = {
  input: UpdateEdgeInput;
};


export type MutationUpdateNodeArgs = {
  input: UpdateNodeInput;
};


export type MutationDeleteEdgeArgs = {
  input: DeleteEdgeInput;
};


export type MutationDeleteNodeArgs = {
  input: DeleteNodeInput;
};

export type CreateNodeInput = {
  Collection?: Maybe<CreateCollectionInput>;
  Resource?: Maybe<CreateResourceInput>;
  Subject?: Maybe<CreateSubjectInput>;
  User?: Maybe<CreateUserInput>;
  nodeType: NodeType;
};

export type CreateNodeMutationPayload = CreateNodeMutationSuccess | CreateNodeMutationError;

export type CreateNodeMutationSuccess = {
  __typename: 'CreateNodeMutationSuccess';
  node?: Maybe<Node>;
};

export type CreateNodeMutationError = {
  __typename: 'CreateNodeMutationError';
  type: CreateNodeMutationErrorType;
  details?: Maybe<Scalars['String']>;
};

export enum CreateNodeMutationErrorType {
  NotAuthorized = 'NotAuthorized',
  UnexpectedInput = 'UnexpectedInput'
}

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

export type CreateEdgeMutationPayload = CreateEdgeMutationSuccess | CreateEdgeMutationError;

export type CreateEdgeMutationSuccess = {
  __typename: 'CreateEdgeMutationSuccess';
  edge?: Maybe<Edge>;
};

export type CreateEdgeMutationError = {
  __typename: 'CreateEdgeMutationError';
  type: CreateEdgeMutationErrorType;
  details?: Maybe<Scalars['String']>;
};

export enum CreateEdgeMutationErrorType {
  NotAuthorized = 'NotAuthorized',
  NotAllowed = 'NotAllowed',
  NoSelfReference = 'NoSelfReference',
  UnexpectedInput = 'UnexpectedInput'
}

export type UpdateNodeInput = {
  Collection?: Maybe<UpdateCollectionInput>;
  Resource?: Maybe<UpdateResourceInput>;
  Subject?: Maybe<UpdateSubjectInput>;
  User?: Maybe<UpdateUserInput>;
  _id: Scalars['ID'];
  nodeType: NodeType;
};

export type UpdateNodeMutationPayload = UpdateNodeMutationSuccess | UpdateNodeMutationError;

export type UpdateNodeMutationSuccess = {
  __typename: 'UpdateNodeMutationSuccess';
  node?: Maybe<Node>;
};

export type UpdateNodeMutationError = {
  __typename: 'UpdateNodeMutationError';
  type: UpdateNodeMutationErrorType;
  details?: Maybe<Scalars['String']>;
};

export enum UpdateNodeMutationErrorType {
  NotFound = 'NotFound',
  NotAuthorized = 'NotAuthorized',
  UnexpectedInput = 'UnexpectedInput'
}

export type UpdateEdgeInput = {
  AppliesTo?: Maybe<Scalars['Empty']>;
  Contains?: Maybe<Scalars['Empty']>;
  Created?: Maybe<Scalars['Empty']>;
  Follows?: Maybe<Scalars['Empty']>;
  Likes?: Maybe<Scalars['Empty']>;
  edgeType: EdgeType;
  id: Scalars['ID'];
};

export type UpdateEdgeMutationPayload = UpdateEdgeMutationSuccess | UpdateEdgeMutationError;

export type UpdateEdgeMutationSuccess = {
  __typename: 'UpdateEdgeMutationSuccess';
  edge?: Maybe<Edge>;
};

export type UpdateEdgeMutationError = {
  __typename: 'UpdateEdgeMutationError';
  type: UpdateEdgeMutationErrorType;
  details?: Maybe<Scalars['String']>;
};

export enum UpdateEdgeMutationErrorType {
  NotFound = 'NotFound',
  NotAuthorized = 'NotAuthorized',
  UnexpectedInput = 'UnexpectedInput'
}

export type DeleteEdgeInput = {
  _id: Scalars['ID'];
  edgeType: EdgeType;
};

export type DeleteEdgeMutationPayload = DeleteEdgeMutationSuccess | DeleteEdgeMutationError;

export type DeleteEdgeMutationSuccess = {
  __typename: 'DeleteEdgeMutationSuccess';
  edge?: Maybe<Edge>;
};

export type DeleteEdgeMutationError = {
  __typename: 'DeleteEdgeMutationError';
  type?: Maybe<DeleteEdgeMutationErrorType>;
  details?: Maybe<Scalars['String']>;
};

export enum DeleteEdgeMutationErrorType {
  NotFound = 'NotFound',
  NotAuthorized = 'NotAuthorized'
}

export type DeleteNodeInput = {
  _id: Scalars['ID'];
  nodeType: NodeType;
};

export type DeleteNodeMutationPayload = DeleteNodeMutationSuccess | DeleteNodeMutationError;

export type DeleteNodeMutationSuccess = {
  __typename: 'DeleteNodeMutationSuccess';
  node?: Maybe<Node>;
};

export type DeleteNodeMutationError = {
  __typename: 'DeleteNodeMutationError';
  type?: Maybe<DeleteNodeMutationErrorType>;
  details?: Maybe<Scalars['String']>;
};

export enum DeleteNodeMutationErrorType {
  NotFound = 'NotFound',
  NotAuthorized = 'NotAuthorized'
}

export type Page = {
  pageInfo: PageInfo;
  edges: Array<PageEdge>;
};

export type PageInfo = {
  __typename: 'PageInfo';
  endCursor?: Maybe<Scalars['Cursor']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['Cursor']>;
};

export type PageEdge = {
  cursor: Scalars['Cursor'];
};

export type PaginationInput = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
};

export type Query = {
  __typename: 'Query';
  getSessionAccountUser?: Maybe<UserSession>;
  globalSearch: SearchPage;
  node?: Maybe<Node>;
};


export type QueryGetSessionAccountUserArgs = {
  userId: Scalars['ID'];
};


export type QueryGlobalSearchArgs = {
  text: Scalars['String'];
  page?: Maybe<PaginationInput>;
};


export type QueryNodeArgs = {
  _id: Scalars['ID'];
};

export type SearchPage = Page & {
  __typename: 'SearchPage';
  pageInfo: PageInfo;
  edges: Array<SearchPageEdge>;
};

export type SearchPageEdge = PageEdge & {
  __typename: 'SearchPageEdge';
  cursor: Scalars['Cursor'];
  node: IContentNode;
};


export type INode = {
  _id?: Maybe<Scalars['ID']>;
  _rel: RelPage;
  _meta?: Maybe<NodeMeta>;
};


export type INode_RelArgs = {
  edge: EdgeTypeInput;
  page?: Maybe<PaginationInput>;
  sort?: Maybe<Array<NodeRelSort>>;
};

export type NodeMeta = {
  __typename: 'NodeMeta';
  created: Scalars['DateTime'];
  updated: Scalars['DateTime'];
  relCount?: Maybe<RelCountMap>;
};

export type EdgeMeta = {
  __typename: 'EdgeMeta';
  created: Scalars['DateTime'];
  updated: Scalars['DateTime'];
};

export type RelCount = {
  __typename: 'RelCount';
  i?: Maybe<Scalars['Int']>;
  o?: Maybe<Scalars['Int']>;
};

export type NodeRelSort = {
  prop: Scalars['String'];
  desc?: Maybe<Scalars['Boolean']>;
  edge?: Maybe<Scalars['Boolean']>;
};

export type IContentNode = {
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
};

export type IEdge = {
  _id?: Maybe<Scalars['ID']>;
  _meta?: Maybe<EdgeMeta>;
};

export type EdgeTypeInput = {
  type: EdgeType;
  node: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
};

export type RelPage = Page & {
  __typename: 'RelPage';
  pageInfo: PageInfo;
  edges: Array<RelPageEdge>;
};

export type RelPageEdge = PageEdge & {
  __typename: 'RelPageEdge';
  cursor: Scalars['Cursor'];
  edge: IEdge;
  node: INode;
};

export type AppliesTo = IEdge & {
  __typename: 'AppliesTo';
  _id: Scalars['ID'];
  _meta?: Maybe<EdgeMeta>;
};

export type RelCountMap = {
  __typename: 'RelCountMap';
  AppliesTo?: Maybe<RelCount>;
  Contains?: Maybe<RelCount>;
  Created?: Maybe<RelCount>;
  Follows?: Maybe<RelCount>;
  Likes?: Maybe<RelCount>;
};

export type Edge = AppliesTo | Contains | Created | Follows | Likes;

export enum EdgeType {
  AppliesTo = 'AppliesTo',
  Contains = 'Contains',
  Created = 'Created',
  Follows = 'Follows',
  Likes = 'Likes'
}

export type Contains = IEdge & {
  __typename: 'Contains';
  _id: Scalars['ID'];
  _meta?: Maybe<EdgeMeta>;
};

export type Created = IEdge & {
  __typename: 'Created';
  _id: Scalars['ID'];
  _meta?: Maybe<EdgeMeta>;
};

export type Follows = IEdge & {
  __typename: 'Follows';
  _id: Scalars['ID'];
  _meta?: Maybe<EdgeMeta>;
};

export type Likes = IEdge & {
  __typename: 'Likes';
  _id: Scalars['ID'];
  _meta?: Maybe<EdgeMeta>;
};

export type UserSession = {
  __typename: 'UserSession';
  user: User;
};

export type Collection = INode & IContentNode & {
  __typename: 'Collection';
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
  _id: Scalars['ID'];
  _meta?: Maybe<NodeMeta>;
  _rel: RelPage;
};


export type Collection_RelArgs = {
  edge: EdgeTypeInput;
  page?: Maybe<PaginationInput>;
  sort?: Maybe<Array<NodeRelSort>>;
};

export type Node = Collection | Resource | Subject | User;

export enum NodeType {
  Collection = 'Collection',
  Resource = 'Resource',
  Subject = 'Subject',
  User = 'User'
}

export type CreateCollectionInput = {
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
};

export type UpdateCollectionInput = {
  name?: Maybe<Scalars['String']>;
};

export type Resource = INode & IContentNode & {
  __typename: 'Resource';
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
  _id: Scalars['ID'];
  _meta?: Maybe<NodeMeta>;
  _rel: RelPage;
};


export type Resource_RelArgs = {
  edge: EdgeTypeInput;
  page?: Maybe<PaginationInput>;
  sort?: Maybe<Array<NodeRelSort>>;
};

export type CreateResourceInput = {
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
};

export type UpdateResourceInput = {
  name?: Maybe<Scalars['String']>;
};

export type Subject = INode & IContentNode & {
  __typename: 'Subject';
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
  _id: Scalars['ID'];
  _meta?: Maybe<NodeMeta>;
  _rel: RelPage;
};


export type Subject_RelArgs = {
  edge: EdgeTypeInput;
  page?: Maybe<PaginationInput>;
  sort?: Maybe<Array<NodeRelSort>>;
};

export type CreateSubjectInput = {
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
};

export type UpdateSubjectInput = {
  name?: Maybe<Scalars['String']>;
};

export type User = INode & IContentNode & {
  __typename: 'User';
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
  _id: Scalars['ID'];
  _meta?: Maybe<NodeMeta>;
  _rel: RelPage;
};


export type User_RelArgs = {
  edge: EdgeTypeInput;
  page?: Maybe<PaginationInput>;
  sort?: Maybe<Array<NodeRelSort>>;
};

export type UpdateUserInput = {
  name?: Maybe<Scalars['String']>;
};

export type CreateUserInput = {
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
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
  Never: ResolverTypeWrapper<Scalars['Never']>;
  Empty: ResolverTypeWrapper<Scalars['Empty']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Mutation: ResolverTypeWrapper<RootValue>;
  CreateNodeInput: CreateNodeInput;
  CreateNodeMutationPayload: ResolversTypes['CreateNodeMutationSuccess'] | ResolversTypes['CreateNodeMutationError'];
  CreateNodeMutationSuccess: ResolverTypeWrapper<Omit<CreateNodeMutationSuccess, 'node'> & { node?: Maybe<ResolversTypes['Node']> }>;
  CreateNodeMutationError: ResolverTypeWrapper<CreateNodeMutationError>;
  String: ResolverTypeWrapper<Scalars['String']>;
  CreateNodeMutationErrorType: CreateNodeMutationErrorType;
  CreateEdgeInput: CreateEdgeInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  CreateEdgeMutationPayload: ResolversTypes['CreateEdgeMutationSuccess'] | ResolversTypes['CreateEdgeMutationError'];
  CreateEdgeMutationSuccess: ResolverTypeWrapper<Omit<CreateEdgeMutationSuccess, 'edge'> & { edge?: Maybe<ResolversTypes['Edge']> }>;
  CreateEdgeMutationError: ResolverTypeWrapper<CreateEdgeMutationError>;
  CreateEdgeMutationErrorType: CreateEdgeMutationErrorType;
  UpdateNodeInput: UpdateNodeInput;
  UpdateNodeMutationPayload: ResolversTypes['UpdateNodeMutationSuccess'] | ResolversTypes['UpdateNodeMutationError'];
  UpdateNodeMutationSuccess: ResolverTypeWrapper<Omit<UpdateNodeMutationSuccess, 'node'> & { node?: Maybe<ResolversTypes['Node']> }>;
  UpdateNodeMutationError: ResolverTypeWrapper<UpdateNodeMutationError>;
  UpdateNodeMutationErrorType: UpdateNodeMutationErrorType;
  UpdateEdgeInput: UpdateEdgeInput;
  UpdateEdgeMutationPayload: ResolversTypes['UpdateEdgeMutationSuccess'] | ResolversTypes['UpdateEdgeMutationError'];
  UpdateEdgeMutationSuccess: ResolverTypeWrapper<Omit<UpdateEdgeMutationSuccess, 'edge'> & { edge?: Maybe<ResolversTypes['Edge']> }>;
  UpdateEdgeMutationError: ResolverTypeWrapper<UpdateEdgeMutationError>;
  UpdateEdgeMutationErrorType: UpdateEdgeMutationErrorType;
  DeleteEdgeInput: DeleteEdgeInput;
  DeleteEdgeMutationPayload: ResolversTypes['DeleteEdgeMutationSuccess'] | ResolversTypes['DeleteEdgeMutationError'];
  DeleteEdgeMutationSuccess: ResolverTypeWrapper<Omit<DeleteEdgeMutationSuccess, 'edge'> & { edge?: Maybe<ResolversTypes['Edge']> }>;
  DeleteEdgeMutationError: ResolverTypeWrapper<DeleteEdgeMutationError>;
  DeleteEdgeMutationErrorType: DeleteEdgeMutationErrorType;
  DeleteNodeInput: DeleteNodeInput;
  DeleteNodeMutationPayload: ResolversTypes['DeleteNodeMutationSuccess'] | ResolversTypes['DeleteNodeMutationError'];
  DeleteNodeMutationSuccess: ResolverTypeWrapper<Omit<DeleteNodeMutationSuccess, 'node'> & { node?: Maybe<ResolversTypes['Node']> }>;
  DeleteNodeMutationError: ResolverTypeWrapper<DeleteNodeMutationError>;
  DeleteNodeMutationErrorType: DeleteNodeMutationErrorType;
  Page: ResolversTypes['SearchPage'] | ResolversTypes['RelPage'];
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  PageEdge: ResolversTypes['SearchPageEdge'] | ResolversTypes['RelPageEdge'];
  PaginationInput: PaginationInput;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Query: ResolverTypeWrapper<RootValue>;
  SearchPage: ResolverTypeWrapper<SearchPage>;
  SearchPageEdge: ResolverTypeWrapper<SearchPageEdge>;
  Cursor: ResolverTypeWrapper<Scalars['Cursor']>;
  INode: ResolversTypes['Collection'] | ResolversTypes['Resource'] | ResolversTypes['Subject'] | ResolversTypes['User'];
  NodeMeta: ResolverTypeWrapper<NodeMeta>;
  EdgeMeta: ResolverTypeWrapper<EdgeMeta>;
  RelCount: ResolverTypeWrapper<RelCount>;
  NodeRelSort: NodeRelSort;
  IContentNode: ResolversTypes['Collection'] | ResolversTypes['Resource'] | ResolversTypes['Subject'] | ResolversTypes['User'];
  IEdge: ResolversTypes['AppliesTo'] | ResolversTypes['Contains'] | ResolversTypes['Created'] | ResolversTypes['Follows'] | ResolversTypes['Likes'];
  EdgeTypeInput: EdgeTypeInput;
  RelPage: ResolverTypeWrapper<RelPage>;
  RelPageEdge: ResolverTypeWrapper<RelPageEdge>;
  AppliesTo: ResolverTypeWrapper<AppliesTo>;
  RelCountMap: ResolverTypeWrapper<RelCountMap>;
  Edge: ResolversTypes['AppliesTo'] | ResolversTypes['Contains'] | ResolversTypes['Created'] | ResolversTypes['Follows'] | ResolversTypes['Likes'];
  EdgeType: EdgeType;
  Contains: ResolverTypeWrapper<Contains>;
  Created: ResolverTypeWrapper<Created>;
  Follows: ResolverTypeWrapper<Follows>;
  Likes: ResolverTypeWrapper<Likes>;
  UserSession: ResolverTypeWrapper<UserSession>;
  Collection: ResolverTypeWrapper<Collection>;
  Node: ResolversTypes['Collection'] | ResolversTypes['Resource'] | ResolversTypes['Subject'] | ResolversTypes['User'];
  NodeType: NodeType;
  CreateCollectionInput: CreateCollectionInput;
  UpdateCollectionInput: UpdateCollectionInput;
  Resource: ResolverTypeWrapper<Resource>;
  CreateResourceInput: CreateResourceInput;
  UpdateResourceInput: UpdateResourceInput;
  Subject: ResolverTypeWrapper<Subject>;
  CreateSubjectInput: CreateSubjectInput;
  UpdateSubjectInput: UpdateSubjectInput;
  User: ResolverTypeWrapper<User>;
  UpdateUserInput: UpdateUserInput;
  CreateUserInput: CreateUserInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Never: Scalars['Never'];
  Empty: Scalars['Empty'];
  DateTime: Scalars['DateTime'];
  Mutation: RootValue;
  CreateNodeInput: CreateNodeInput;
  CreateNodeMutationPayload: ResolversParentTypes['CreateNodeMutationSuccess'] | ResolversParentTypes['CreateNodeMutationError'];
  CreateNodeMutationSuccess: Omit<CreateNodeMutationSuccess, 'node'> & { node?: Maybe<ResolversParentTypes['Node']> };
  CreateNodeMutationError: CreateNodeMutationError;
  String: Scalars['String'];
  CreateEdgeInput: CreateEdgeInput;
  ID: Scalars['ID'];
  CreateEdgeMutationPayload: ResolversParentTypes['CreateEdgeMutationSuccess'] | ResolversParentTypes['CreateEdgeMutationError'];
  CreateEdgeMutationSuccess: Omit<CreateEdgeMutationSuccess, 'edge'> & { edge?: Maybe<ResolversParentTypes['Edge']> };
  CreateEdgeMutationError: CreateEdgeMutationError;
  UpdateNodeInput: UpdateNodeInput;
  UpdateNodeMutationPayload: ResolversParentTypes['UpdateNodeMutationSuccess'] | ResolversParentTypes['UpdateNodeMutationError'];
  UpdateNodeMutationSuccess: Omit<UpdateNodeMutationSuccess, 'node'> & { node?: Maybe<ResolversParentTypes['Node']> };
  UpdateNodeMutationError: UpdateNodeMutationError;
  UpdateEdgeInput: UpdateEdgeInput;
  UpdateEdgeMutationPayload: ResolversParentTypes['UpdateEdgeMutationSuccess'] | ResolversParentTypes['UpdateEdgeMutationError'];
  UpdateEdgeMutationSuccess: Omit<UpdateEdgeMutationSuccess, 'edge'> & { edge?: Maybe<ResolversParentTypes['Edge']> };
  UpdateEdgeMutationError: UpdateEdgeMutationError;
  DeleteEdgeInput: DeleteEdgeInput;
  DeleteEdgeMutationPayload: ResolversParentTypes['DeleteEdgeMutationSuccess'] | ResolversParentTypes['DeleteEdgeMutationError'];
  DeleteEdgeMutationSuccess: Omit<DeleteEdgeMutationSuccess, 'edge'> & { edge?: Maybe<ResolversParentTypes['Edge']> };
  DeleteEdgeMutationError: DeleteEdgeMutationError;
  DeleteNodeInput: DeleteNodeInput;
  DeleteNodeMutationPayload: ResolversParentTypes['DeleteNodeMutationSuccess'] | ResolversParentTypes['DeleteNodeMutationError'];
  DeleteNodeMutationSuccess: Omit<DeleteNodeMutationSuccess, 'node'> & { node?: Maybe<ResolversParentTypes['Node']> };
  DeleteNodeMutationError: DeleteNodeMutationError;
  Page: ResolversParentTypes['SearchPage'] | ResolversParentTypes['RelPage'];
  PageInfo: PageInfo;
  Boolean: Scalars['Boolean'];
  PageEdge: ResolversParentTypes['SearchPageEdge'] | ResolversParentTypes['RelPageEdge'];
  PaginationInput: PaginationInput;
  Int: Scalars['Int'];
  Query: RootValue;
  SearchPage: SearchPage;
  SearchPageEdge: SearchPageEdge;
  Cursor: Scalars['Cursor'];
  INode: ResolversParentTypes['Collection'] | ResolversParentTypes['Resource'] | ResolversParentTypes['Subject'] | ResolversParentTypes['User'];
  NodeMeta: NodeMeta;
  EdgeMeta: EdgeMeta;
  RelCount: RelCount;
  NodeRelSort: NodeRelSort;
  IContentNode: ResolversParentTypes['Collection'] | ResolversParentTypes['Resource'] | ResolversParentTypes['Subject'] | ResolversParentTypes['User'];
  IEdge: ResolversParentTypes['AppliesTo'] | ResolversParentTypes['Contains'] | ResolversParentTypes['Created'] | ResolversParentTypes['Follows'] | ResolversParentTypes['Likes'];
  EdgeTypeInput: EdgeTypeInput;
  RelPage: RelPage;
  RelPageEdge: RelPageEdge;
  AppliesTo: AppliesTo;
  RelCountMap: RelCountMap;
  Edge: ResolversParentTypes['AppliesTo'] | ResolversParentTypes['Contains'] | ResolversParentTypes['Created'] | ResolversParentTypes['Follows'] | ResolversParentTypes['Likes'];
  Contains: Contains;
  Created: Created;
  Follows: Follows;
  Likes: Likes;
  UserSession: UserSession;
  Collection: Collection;
  Node: ResolversParentTypes['Collection'] | ResolversParentTypes['Resource'] | ResolversParentTypes['Subject'] | ResolversParentTypes['User'];
  CreateCollectionInput: CreateCollectionInput;
  UpdateCollectionInput: UpdateCollectionInput;
  Resource: Resource;
  CreateResourceInput: CreateResourceInput;
  UpdateResourceInput: UpdateResourceInput;
  Subject: Subject;
  CreateSubjectInput: CreateSubjectInput;
  UpdateSubjectInput: UpdateSubjectInput;
  User: User;
  UpdateUserInput: UpdateUserInput;
  CreateUserInput: CreateUserInput;
};

export interface NeverScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Never'], any> {
  name: 'Never';
}

export interface EmptyScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Empty'], any> {
  name: 'Empty';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type MutationResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createEdge?: Resolver<ResolversTypes['CreateEdgeMutationPayload'], ParentType, ContextType, RequireFields<MutationCreateEdgeArgs, 'input'>>;
  createNode?: Resolver<ResolversTypes['CreateNodeMutationPayload'], ParentType, ContextType, RequireFields<MutationCreateNodeArgs, 'input'>>;
  updateEdge?: Resolver<ResolversTypes['UpdateEdgeMutationPayload'], ParentType, ContextType, RequireFields<MutationUpdateEdgeArgs, 'input'>>;
  updateNode?: Resolver<ResolversTypes['UpdateNodeMutationPayload'], ParentType, ContextType, RequireFields<MutationUpdateNodeArgs, 'input'>>;
  deleteEdge?: Resolver<ResolversTypes['DeleteEdgeMutationPayload'], ParentType, ContextType, RequireFields<MutationDeleteEdgeArgs, 'input'>>;
  deleteNode?: Resolver<ResolversTypes['DeleteNodeMutationPayload'], ParentType, ContextType, RequireFields<MutationDeleteNodeArgs, 'input'>>;
};

export type CreateNodeMutationPayloadResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['CreateNodeMutationPayload'] = ResolversParentTypes['CreateNodeMutationPayload']> = {
  __resolveType: TypeResolveFn<'CreateNodeMutationSuccess' | 'CreateNodeMutationError', ParentType, ContextType>;
};

export type CreateNodeMutationSuccessResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['CreateNodeMutationSuccess'] = ResolversParentTypes['CreateNodeMutationSuccess']> = {
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateNodeMutationErrorResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['CreateNodeMutationError'] = ResolversParentTypes['CreateNodeMutationError']> = {
  type?: Resolver<ResolversTypes['CreateNodeMutationErrorType'], ParentType, ContextType>;
  details?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateEdgeMutationPayloadResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['CreateEdgeMutationPayload'] = ResolversParentTypes['CreateEdgeMutationPayload']> = {
  __resolveType: TypeResolveFn<'CreateEdgeMutationSuccess' | 'CreateEdgeMutationError', ParentType, ContextType>;
};

export type CreateEdgeMutationSuccessResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['CreateEdgeMutationSuccess'] = ResolversParentTypes['CreateEdgeMutationSuccess']> = {
  edge?: Resolver<Maybe<ResolversTypes['Edge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateEdgeMutationErrorResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['CreateEdgeMutationError'] = ResolversParentTypes['CreateEdgeMutationError']> = {
  type?: Resolver<ResolversTypes['CreateEdgeMutationErrorType'], ParentType, ContextType>;
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

export type UpdateNodeMutationErrorResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['UpdateNodeMutationError'] = ResolversParentTypes['UpdateNodeMutationError']> = {
  type?: Resolver<ResolversTypes['UpdateNodeMutationErrorType'], ParentType, ContextType>;
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

export type UpdateEdgeMutationErrorResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['UpdateEdgeMutationError'] = ResolversParentTypes['UpdateEdgeMutationError']> = {
  type?: Resolver<ResolversTypes['UpdateEdgeMutationErrorType'], ParentType, ContextType>;
  details?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteEdgeMutationPayloadResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['DeleteEdgeMutationPayload'] = ResolversParentTypes['DeleteEdgeMutationPayload']> = {
  __resolveType: TypeResolveFn<'DeleteEdgeMutationSuccess' | 'DeleteEdgeMutationError', ParentType, ContextType>;
};

export type DeleteEdgeMutationSuccessResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['DeleteEdgeMutationSuccess'] = ResolversParentTypes['DeleteEdgeMutationSuccess']> = {
  edge?: Resolver<Maybe<ResolversTypes['Edge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteEdgeMutationErrorResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['DeleteEdgeMutationError'] = ResolversParentTypes['DeleteEdgeMutationError']> = {
  type?: Resolver<Maybe<ResolversTypes['DeleteEdgeMutationErrorType']>, ParentType, ContextType>;
  details?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteNodeMutationPayloadResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['DeleteNodeMutationPayload'] = ResolversParentTypes['DeleteNodeMutationPayload']> = {
  __resolveType: TypeResolveFn<'DeleteNodeMutationSuccess' | 'DeleteNodeMutationError', ParentType, ContextType>;
};

export type DeleteNodeMutationSuccessResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['DeleteNodeMutationSuccess'] = ResolversParentTypes['DeleteNodeMutationSuccess']> = {
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteNodeMutationErrorResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['DeleteNodeMutationError'] = ResolversParentTypes['DeleteNodeMutationError']> = {
  type?: Resolver<Maybe<ResolversTypes['DeleteNodeMutationErrorType']>, ParentType, ContextType>;
  details?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Page'] = ResolversParentTypes['Page']> = {
  __resolveType: TypeResolveFn<'SearchPage' | 'RelPage', ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['PageEdge']>, ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageEdgeResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['PageEdge'] = ResolversParentTypes['PageEdge']> = {
  __resolveType: TypeResolveFn<'SearchPageEdge' | 'RelPageEdge', ParentType, ContextType>;
  cursor?: Resolver<ResolversTypes['Cursor'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getSessionAccountUser?: Resolver<Maybe<ResolversTypes['UserSession']>, ParentType, ContextType, RequireFields<QueryGetSessionAccountUserArgs, 'userId'>>;
  globalSearch?: Resolver<ResolversTypes['SearchPage'], ParentType, ContextType, RequireFields<QueryGlobalSearchArgs, 'text'>>;
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, '_id'>>;
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

export interface CursorScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Cursor'], any> {
  name: 'Cursor';
}

export type INodeResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['INode'] = ResolversParentTypes['INode']> = {
  __resolveType: TypeResolveFn<'Collection' | 'Resource' | 'Subject' | 'User', ParentType, ContextType>;
  _id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<INode_RelArgs, 'edge'>>;
  _meta?: Resolver<Maybe<ResolversTypes['NodeMeta']>, ParentType, ContextType>;
};

export type NodeMetaResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['NodeMeta'] = ResolversParentTypes['NodeMeta']> = {
  created?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updated?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  relCount?: Resolver<Maybe<ResolversTypes['RelCountMap']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EdgeMetaResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['EdgeMeta'] = ResolversParentTypes['EdgeMeta']> = {
  created?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updated?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RelCountResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['RelCount'] = ResolversParentTypes['RelCount']> = {
  i?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  o?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IContentNodeResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['IContentNode'] = ResolversParentTypes['IContentNode']> = {
  __resolveType: TypeResolveFn<'Collection' | 'Resource' | 'Subject' | 'User', ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type IEdgeResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['IEdge'] = ResolversParentTypes['IEdge']> = {
  __resolveType: TypeResolveFn<'AppliesTo' | 'Contains' | 'Created' | 'Follows' | 'Likes', ParentType, ContextType>;
  _id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  _meta?: Resolver<Maybe<ResolversTypes['EdgeMeta']>, ParentType, ContextType>;
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

export type AppliesToResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['AppliesTo'] = ResolversParentTypes['AppliesTo']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _meta?: Resolver<Maybe<ResolversTypes['EdgeMeta']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RelCountMapResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['RelCountMap'] = ResolversParentTypes['RelCountMap']> = {
  AppliesTo?: Resolver<Maybe<ResolversTypes['RelCount']>, ParentType, ContextType>;
  Contains?: Resolver<Maybe<ResolversTypes['RelCount']>, ParentType, ContextType>;
  Created?: Resolver<Maybe<ResolversTypes['RelCount']>, ParentType, ContextType>;
  Follows?: Resolver<Maybe<ResolversTypes['RelCount']>, ParentType, ContextType>;
  Likes?: Resolver<Maybe<ResolversTypes['RelCount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EdgeResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Edge'] = ResolversParentTypes['Edge']> = {
  __resolveType: TypeResolveFn<'AppliesTo' | 'Contains' | 'Created' | 'Follows' | 'Likes', ParentType, ContextType>;
};

export type ContainsResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Contains'] = ResolversParentTypes['Contains']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _meta?: Resolver<Maybe<ResolversTypes['EdgeMeta']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreatedResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Created'] = ResolversParentTypes['Created']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _meta?: Resolver<Maybe<ResolversTypes['EdgeMeta']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FollowsResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Follows'] = ResolversParentTypes['Follows']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _meta?: Resolver<Maybe<ResolversTypes['EdgeMeta']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LikesResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Likes'] = ResolversParentTypes['Likes']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _meta?: Resolver<Maybe<ResolversTypes['EdgeMeta']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSessionResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['UserSession'] = ResolversParentTypes['UserSession']> = {
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Collection'] = ResolversParentTypes['Collection']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _meta?: Resolver<Maybe<ResolversTypes['NodeMeta']>, ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Collection_RelArgs, 'edge'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NodeResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'Collection' | 'Resource' | 'Subject' | 'User', ParentType, ContextType>;
};

export type ResourceResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Resource'] = ResolversParentTypes['Resource']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _meta?: Resolver<Maybe<ResolversTypes['NodeMeta']>, ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Resource_RelArgs, 'edge'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubjectResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Subject'] = ResolversParentTypes['Subject']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _meta?: Resolver<Maybe<ResolversTypes['NodeMeta']>, ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Subject_RelArgs, 'edge'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _meta?: Resolver<Maybe<ResolversTypes['NodeMeta']>, ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<User_RelArgs, 'edge'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = MoodleNetExecutionContext> = {
  Never?: GraphQLScalarType;
  Empty?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  CreateNodeMutationPayload?: CreateNodeMutationPayloadResolvers<ContextType>;
  CreateNodeMutationSuccess?: CreateNodeMutationSuccessResolvers<ContextType>;
  CreateNodeMutationError?: CreateNodeMutationErrorResolvers<ContextType>;
  CreateEdgeMutationPayload?: CreateEdgeMutationPayloadResolvers<ContextType>;
  CreateEdgeMutationSuccess?: CreateEdgeMutationSuccessResolvers<ContextType>;
  CreateEdgeMutationError?: CreateEdgeMutationErrorResolvers<ContextType>;
  UpdateNodeMutationPayload?: UpdateNodeMutationPayloadResolvers<ContextType>;
  UpdateNodeMutationSuccess?: UpdateNodeMutationSuccessResolvers<ContextType>;
  UpdateNodeMutationError?: UpdateNodeMutationErrorResolvers<ContextType>;
  UpdateEdgeMutationPayload?: UpdateEdgeMutationPayloadResolvers<ContextType>;
  UpdateEdgeMutationSuccess?: UpdateEdgeMutationSuccessResolvers<ContextType>;
  UpdateEdgeMutationError?: UpdateEdgeMutationErrorResolvers<ContextType>;
  DeleteEdgeMutationPayload?: DeleteEdgeMutationPayloadResolvers<ContextType>;
  DeleteEdgeMutationSuccess?: DeleteEdgeMutationSuccessResolvers<ContextType>;
  DeleteEdgeMutationError?: DeleteEdgeMutationErrorResolvers<ContextType>;
  DeleteNodeMutationPayload?: DeleteNodeMutationPayloadResolvers<ContextType>;
  DeleteNodeMutationSuccess?: DeleteNodeMutationSuccessResolvers<ContextType>;
  DeleteNodeMutationError?: DeleteNodeMutationErrorResolvers<ContextType>;
  Page?: PageResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  PageEdge?: PageEdgeResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SearchPage?: SearchPageResolvers<ContextType>;
  SearchPageEdge?: SearchPageEdgeResolvers<ContextType>;
  Cursor?: GraphQLScalarType;
  INode?: INodeResolvers<ContextType>;
  NodeMeta?: NodeMetaResolvers<ContextType>;
  EdgeMeta?: EdgeMetaResolvers<ContextType>;
  RelCount?: RelCountResolvers<ContextType>;
  IContentNode?: IContentNodeResolvers<ContextType>;
  IEdge?: IEdgeResolvers<ContextType>;
  RelPage?: RelPageResolvers<ContextType>;
  RelPageEdge?: RelPageEdgeResolvers<ContextType>;
  AppliesTo?: AppliesToResolvers<ContextType>;
  RelCountMap?: RelCountMapResolvers<ContextType>;
  Edge?: EdgeResolvers<ContextType>;
  Contains?: ContainsResolvers<ContextType>;
  Created?: CreatedResolvers<ContextType>;
  Follows?: FollowsResolvers<ContextType>;
  Likes?: LikesResolvers<ContextType>;
  UserSession?: UserSessionResolvers<ContextType>;
  Collection?: CollectionResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  Resource?: ResourceResolvers<ContextType>;
  Subject?: SubjectResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = MoodleNetExecutionContext> = Resolvers<ContextType>;
