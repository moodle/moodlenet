import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Context, RootValue } from '../../MoodleNetGraphQL';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Empty: {};
  DateTime: Date;
};


export enum AccessLevel {
  Admin = 'ADMIN',
  User = 'USER',
  Owner = 'OWNER'
}

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
  edgeType: EdgeType;
  from: Scalars['ID'];
  to: Scalars['ID'];
  edge: CreateEdgeInput;
};


export type MutationCreateNodeArgs = {
  nodeType: NodeType;
  node: CreateNodeInput;
};


export type MutationUpdateEdgeArgs = {
  edgeType: EdgeType;
  edge: UpdateEdgeInput;
};


export type MutationUpdateNodeArgs = {
  nodeType: NodeType;
  node: UpdateNodeInput;
};


export type MutationDeleteEdgeArgs = {
  edgeType: EdgeType;
  edge: DeleteEdgeInput;
};


export type MutationDeleteNodeArgs = {
  nodeType: NodeType;
  node: DeleteNodeInput;
};

export type CreateNodeMutationPayload = CreateNodeMutationSuccess | CreateNodeMutationError;

export type CreateNodeMutationSuccess = {
  __typename: 'CreateNodeMutationSuccess';
  node: Maybe<Node>;
};

export type CreateNodeMutationError = {
  __typename: 'CreateNodeMutationError';
  type: CreateNodeMutationErrorType;
  details: Maybe<Scalars['String']>;
};

export enum CreateNodeMutationErrorType {
  NotAuthorized = 'NotAuthorized',
  UnexpectedInput = 'UnexpectedInput'
}

export type CreateEdgeMutationPayload = CreateEdgeMutationSuccess | CreateEdgeMutationError;

export type CreateEdgeMutationSuccess = {
  __typename: 'CreateEdgeMutationSuccess';
  edge: Maybe<Edge>;
  from: Maybe<Node>;
  to: Maybe<Node>;
};

export type CreateEdgeMutationError = {
  __typename: 'CreateEdgeMutationError';
  type: CreateEdgeMutationErrorType;
  details: Maybe<Scalars['String']>;
};

export enum CreateEdgeMutationErrorType {
  NotAuthorized = 'NotAuthorized',
  NoSelfReference = 'NoSelfReference',
  UnexpectedInput = 'UnexpectedInput'
}

export type UpdateNodeInput = {
  Subject: Maybe<UpdateSubjectInput>;
  User: Maybe<UpdateUserInput>;
  _id: Scalars['ID'];
};

export type UpdateNodeMutationPayload = UpdateNodeMutationSuccess | UpdateNodeMutationError;

export type UpdateNodeMutationSuccess = {
  __typename: 'UpdateNodeMutationSuccess';
  node: Maybe<Node>;
};

export type UpdateNodeMutationError = {
  __typename: 'UpdateNodeMutationError';
  type: UpdateNodeMutationErrorType;
  details: Maybe<Scalars['String']>;
};

export enum UpdateNodeMutationErrorType {
  NotFound = 'NotFound',
  NotAuthorized = 'NotAuthorized',
  UnexpectedInput = 'UnexpectedInput'
}

export type UpdateEdgeInput = {
  Follows: Maybe<Scalars['Empty']>;
  _id: Scalars['ID'];
};

export type UpdateEdgeMutationPayload = UpdateEdgeMutationSuccess | UpdateEdgeMutationError;

export type UpdateEdgeMutationSuccess = {
  __typename: 'UpdateEdgeMutationSuccess';
  edge: Maybe<Edge>;
  from: Maybe<Node>;
  to: Maybe<Node>;
};

export type UpdateEdgeMutationError = {
  __typename: 'UpdateEdgeMutationError';
  type: UpdateEdgeMutationErrorType;
  details: Maybe<Scalars['String']>;
};

export enum UpdateEdgeMutationErrorType {
  NotFound = 'NotFound',
  NotAuthorized = 'NotAuthorized',
  UnexpectedInput = 'UnexpectedInput'
}

export type DeleteEdgeInput = {
  _id: Scalars['ID'];
};

export type DeleteEdgeMutationPayload = DeleteEdgeMutationSuccess | DeleteEdgeMutationError;

export type DeleteEdgeMutationSuccess = {
  __typename: 'DeleteEdgeMutationSuccess';
  edge: Maybe<Edge>;
  from: Maybe<Node>;
  to: Maybe<Node>;
};

export type DeleteEdgeMutationError = {
  __typename: 'DeleteEdgeMutationError';
  type: Maybe<DeleteEdgeMutationErrorType>;
  details: Maybe<Scalars['String']>;
};

export enum DeleteEdgeMutationErrorType {
  NotFound = 'NotFound',
  NotAuthorized = 'NotAuthorized'
}

export type DeleteNodeInput = {
  _id: Scalars['ID'];
};

export type DeleteNodeMutationPayload = DeleteNodeMutationSuccess | DeleteNodeMutationError;

export type DeleteNodeMutationSuccess = {
  __typename: 'DeleteNodeMutationSuccess';
  node: Maybe<Node>;
};

export type DeleteNodeMutationError = {
  __typename: 'DeleteNodeMutationError';
  type: Maybe<DeleteNodeMutationErrorType>;
  details: Maybe<Scalars['String']>;
};

export enum DeleteNodeMutationErrorType {
  NotFound = 'NotFound',
  NotAuthorized = 'NotAuthorized'
}

export type Page = {
  __typename: 'Page';
  pageInfo: PageInfo;
  edges: Array<PageEdge>;
};

export type PageInfo = {
  __typename: 'PageInfo';
  endCursor: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor: Maybe<Scalars['String']>;
};

export type PageEdge = {
  __typename: 'PageEdge';
  cursor: Scalars['String'];
  edge: IEdge;
  node: INode;
};

export type PageInput = {
  first: Maybe<Scalars['Int']>;
  after: Maybe<Scalars['String']>;
  before: Maybe<Scalars['String']>;
  last: Maybe<Scalars['Int']>;
};

export type QueryNodePayload = QueryNodeSuccess | QueryNodeError;

export type QueryNodeSuccess = {
  __typename: 'QueryNodeSuccess';
  result: Maybe<Node>;
};

export type QueryNodeError = {
  __typename: 'QueryNodeError';
  type: QueryNodeErrorType;
  details: Maybe<Scalars['String']>;
};

export enum QueryNodeErrorType {
  NotFound = 'NotFound',
  NotAuthorized = 'NotAuthorized'
}

export type Query = {
  __typename: 'Query';
  node: QueryNodePayload;
};


export type QueryNodeArgs = {
  _id: Scalars['ID'];
  nodeType: NodeType;
};



export type INode = {
  _id: Maybe<Scalars['ID']>;
  _meta: Meta;
  _rel: Page;
};


export type INode_RelArgs = {
  edge: EdgeTypeInput;
  page: Maybe<PageInput>;
};

export type IEdge = {
  _id: Maybe<Scalars['ID']>;
  _meta: Meta;
};

export type EdgeTypeInput = {
  type: EdgeType;
  node: NodeType;
  rev: Maybe<Scalars['Boolean']>;
};

export type Meta = {
  __typename: 'Meta';
  created: ByAt;
  lastUpdate: ByAt;
};

export type ByAt = {
  __typename: 'ByAt';
  by: User;
  at: Scalars['DateTime'];
};

export enum Role {
  User = 'User',
  Admin = 'Admin',
  Root = 'Root'
}

export type Follows = IEdge & {
  __typename: 'Follows';
  _id: Scalars['ID'];
  _meta: Meta;
};

export type Edge = Follows;

export enum EdgeType {
  Follows = 'Follows'
}

export type CreateEdgeInput = {
  Follows: Maybe<Scalars['Empty']>;
};

export type Subject = INode & {
  __typename: 'Subject';
  _id: Scalars['ID'];
  _meta: Meta;
  _rel: Page;
  name: Scalars['String'];
};


export type Subject_RelArgs = {
  edge: EdgeTypeInput;
  page: Maybe<PageInput>;
};

export type Node = Subject | User;

export enum NodeType {
  Subject = 'Subject',
  User = 'User'
}

export type CreateNodeInput = {
  Subject: Maybe<CreateSubjectInput>;
};

export type CreateSubjectInput = {
  name: Scalars['String'];
};

export type UpdateSubjectInput = {
  name: Maybe<Scalars['String']>;
};

export type User = INode & {
  __typename: 'User';
  _id: Scalars['ID'];
  _meta: Meta;
  _rel: Page;
  role: Role;
  displayName: Scalars['String'];
};


export type User_RelArgs = {
  edge: EdgeTypeInput;
  page: Maybe<PageInput>;
};

export type UpdateUserInput = {
  displayName: Maybe<Scalars['String']>;
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
  AccessLevel: AccessLevel;
  Mutation: ResolverTypeWrapper<RootValue>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  CreateNodeMutationPayload: ResolversTypes['CreateNodeMutationSuccess'] | ResolversTypes['CreateNodeMutationError'];
  CreateNodeMutationSuccess: ResolverTypeWrapper<Omit<CreateNodeMutationSuccess, 'node'> & { node: Maybe<ResolversTypes['Node']> }>;
  CreateNodeMutationError: ResolverTypeWrapper<CreateNodeMutationError>;
  String: ResolverTypeWrapper<Scalars['String']>;
  CreateNodeMutationErrorType: CreateNodeMutationErrorType;
  CreateEdgeMutationPayload: ResolversTypes['CreateEdgeMutationSuccess'] | ResolversTypes['CreateEdgeMutationError'];
  CreateEdgeMutationSuccess: ResolverTypeWrapper<Omit<CreateEdgeMutationSuccess, 'edge' | 'from' | 'to'> & { edge: Maybe<ResolversTypes['Edge']>, from: Maybe<ResolversTypes['Node']>, to: Maybe<ResolversTypes['Node']> }>;
  CreateEdgeMutationError: ResolverTypeWrapper<CreateEdgeMutationError>;
  CreateEdgeMutationErrorType: CreateEdgeMutationErrorType;
  UpdateNodeInput: UpdateNodeInput;
  UpdateNodeMutationPayload: ResolversTypes['UpdateNodeMutationSuccess'] | ResolversTypes['UpdateNodeMutationError'];
  UpdateNodeMutationSuccess: ResolverTypeWrapper<Omit<UpdateNodeMutationSuccess, 'node'> & { node: Maybe<ResolversTypes['Node']> }>;
  UpdateNodeMutationError: ResolverTypeWrapper<UpdateNodeMutationError>;
  UpdateNodeMutationErrorType: UpdateNodeMutationErrorType;
  UpdateEdgeInput: UpdateEdgeInput;
  UpdateEdgeMutationPayload: ResolversTypes['UpdateEdgeMutationSuccess'] | ResolversTypes['UpdateEdgeMutationError'];
  UpdateEdgeMutationSuccess: ResolverTypeWrapper<Omit<UpdateEdgeMutationSuccess, 'edge' | 'from' | 'to'> & { edge: Maybe<ResolversTypes['Edge']>, from: Maybe<ResolversTypes['Node']>, to: Maybe<ResolversTypes['Node']> }>;
  UpdateEdgeMutationError: ResolverTypeWrapper<UpdateEdgeMutationError>;
  UpdateEdgeMutationErrorType: UpdateEdgeMutationErrorType;
  DeleteEdgeInput: DeleteEdgeInput;
  DeleteEdgeMutationPayload: ResolversTypes['DeleteEdgeMutationSuccess'] | ResolversTypes['DeleteEdgeMutationError'];
  DeleteEdgeMutationSuccess: ResolverTypeWrapper<Omit<DeleteEdgeMutationSuccess, 'edge' | 'from' | 'to'> & { edge: Maybe<ResolversTypes['Edge']>, from: Maybe<ResolversTypes['Node']>, to: Maybe<ResolversTypes['Node']> }>;
  DeleteEdgeMutationError: ResolverTypeWrapper<DeleteEdgeMutationError>;
  DeleteEdgeMutationErrorType: DeleteEdgeMutationErrorType;
  DeleteNodeInput: DeleteNodeInput;
  DeleteNodeMutationPayload: ResolversTypes['DeleteNodeMutationSuccess'] | ResolversTypes['DeleteNodeMutationError'];
  DeleteNodeMutationSuccess: ResolverTypeWrapper<Omit<DeleteNodeMutationSuccess, 'node'> & { node: Maybe<ResolversTypes['Node']> }>;
  DeleteNodeMutationError: ResolverTypeWrapper<DeleteNodeMutationError>;
  DeleteNodeMutationErrorType: DeleteNodeMutationErrorType;
  Page: ResolverTypeWrapper<Page>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  PageEdge: ResolverTypeWrapper<PageEdge>;
  PageInput: PageInput;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  QueryNodePayload: ResolversTypes['QueryNodeSuccess'] | ResolversTypes['QueryNodeError'];
  QueryNodeSuccess: ResolverTypeWrapper<Omit<QueryNodeSuccess, 'result'> & { result: Maybe<ResolversTypes['Node']> }>;
  QueryNodeError: ResolverTypeWrapper<QueryNodeError>;
  QueryNodeErrorType: QueryNodeErrorType;
  Query: ResolverTypeWrapper<RootValue>;
  Empty: ResolverTypeWrapper<Scalars['Empty']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  INode: ResolversTypes['Subject'] | ResolversTypes['User'];
  IEdge: ResolversTypes['Follows'];
  EdgeTypeInput: EdgeTypeInput;
  Meta: ResolverTypeWrapper<Meta>;
  ByAt: ResolverTypeWrapper<ByAt>;
  Role: Role;
  Follows: ResolverTypeWrapper<Follows>;
  Edge: ResolversTypes['Follows'];
  EdgeType: EdgeType;
  CreateEdgeInput: CreateEdgeInput;
  Subject: ResolverTypeWrapper<Subject>;
  Node: ResolversTypes['Subject'] | ResolversTypes['User'];
  NodeType: NodeType;
  CreateNodeInput: CreateNodeInput;
  CreateSubjectInput: CreateSubjectInput;
  UpdateSubjectInput: UpdateSubjectInput;
  User: ResolverTypeWrapper<User>;
  UpdateUserInput: UpdateUserInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Mutation: RootValue;
  ID: Scalars['ID'];
  CreateNodeMutationPayload: ResolversParentTypes['CreateNodeMutationSuccess'] | ResolversParentTypes['CreateNodeMutationError'];
  CreateNodeMutationSuccess: Omit<CreateNodeMutationSuccess, 'node'> & { node: Maybe<ResolversParentTypes['Node']> };
  CreateNodeMutationError: CreateNodeMutationError;
  String: Scalars['String'];
  CreateEdgeMutationPayload: ResolversParentTypes['CreateEdgeMutationSuccess'] | ResolversParentTypes['CreateEdgeMutationError'];
  CreateEdgeMutationSuccess: Omit<CreateEdgeMutationSuccess, 'edge' | 'from' | 'to'> & { edge: Maybe<ResolversParentTypes['Edge']>, from: Maybe<ResolversParentTypes['Node']>, to: Maybe<ResolversParentTypes['Node']> };
  CreateEdgeMutationError: CreateEdgeMutationError;
  UpdateNodeInput: UpdateNodeInput;
  UpdateNodeMutationPayload: ResolversParentTypes['UpdateNodeMutationSuccess'] | ResolversParentTypes['UpdateNodeMutationError'];
  UpdateNodeMutationSuccess: Omit<UpdateNodeMutationSuccess, 'node'> & { node: Maybe<ResolversParentTypes['Node']> };
  UpdateNodeMutationError: UpdateNodeMutationError;
  UpdateEdgeInput: UpdateEdgeInput;
  UpdateEdgeMutationPayload: ResolversParentTypes['UpdateEdgeMutationSuccess'] | ResolversParentTypes['UpdateEdgeMutationError'];
  UpdateEdgeMutationSuccess: Omit<UpdateEdgeMutationSuccess, 'edge' | 'from' | 'to'> & { edge: Maybe<ResolversParentTypes['Edge']>, from: Maybe<ResolversParentTypes['Node']>, to: Maybe<ResolversParentTypes['Node']> };
  UpdateEdgeMutationError: UpdateEdgeMutationError;
  DeleteEdgeInput: DeleteEdgeInput;
  DeleteEdgeMutationPayload: ResolversParentTypes['DeleteEdgeMutationSuccess'] | ResolversParentTypes['DeleteEdgeMutationError'];
  DeleteEdgeMutationSuccess: Omit<DeleteEdgeMutationSuccess, 'edge' | 'from' | 'to'> & { edge: Maybe<ResolversParentTypes['Edge']>, from: Maybe<ResolversParentTypes['Node']>, to: Maybe<ResolversParentTypes['Node']> };
  DeleteEdgeMutationError: DeleteEdgeMutationError;
  DeleteNodeInput: DeleteNodeInput;
  DeleteNodeMutationPayload: ResolversParentTypes['DeleteNodeMutationSuccess'] | ResolversParentTypes['DeleteNodeMutationError'];
  DeleteNodeMutationSuccess: Omit<DeleteNodeMutationSuccess, 'node'> & { node: Maybe<ResolversParentTypes['Node']> };
  DeleteNodeMutationError: DeleteNodeMutationError;
  Page: Page;
  PageInfo: PageInfo;
  Boolean: Scalars['Boolean'];
  PageEdge: PageEdge;
  PageInput: PageInput;
  Int: Scalars['Int'];
  QueryNodePayload: ResolversParentTypes['QueryNodeSuccess'] | ResolversParentTypes['QueryNodeError'];
  QueryNodeSuccess: Omit<QueryNodeSuccess, 'result'> & { result: Maybe<ResolversParentTypes['Node']> };
  QueryNodeError: QueryNodeError;
  Query: RootValue;
  Empty: Scalars['Empty'];
  DateTime: Scalars['DateTime'];
  INode: ResolversParentTypes['Subject'] | ResolversParentTypes['User'];
  IEdge: ResolversParentTypes['Follows'];
  EdgeTypeInput: EdgeTypeInput;
  Meta: Meta;
  ByAt: ByAt;
  Follows: Follows;
  Edge: ResolversParentTypes['Follows'];
  CreateEdgeInput: CreateEdgeInput;
  Subject: Subject;
  Node: ResolversParentTypes['Subject'] | ResolversParentTypes['User'];
  CreateNodeInput: CreateNodeInput;
  CreateSubjectInput: CreateSubjectInput;
  UpdateSubjectInput: UpdateSubjectInput;
  User: User;
  UpdateUserInput: UpdateUserInput;
};

export type AccessDirectiveArgs = {   level: Array<AccessLevel>; };

export type AccessDirectiveResolver<Result, Parent, ContextType = Context, Args = AccessDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createEdge: Resolver<ResolversTypes['CreateEdgeMutationPayload'], ParentType, ContextType, RequireFields<MutationCreateEdgeArgs, 'edgeType' | 'from' | 'to' | 'edge'>>;
  createNode: Resolver<ResolversTypes['CreateNodeMutationPayload'], ParentType, ContextType, RequireFields<MutationCreateNodeArgs, 'nodeType' | 'node'>>;
  updateEdge: Resolver<ResolversTypes['UpdateEdgeMutationPayload'], ParentType, ContextType, RequireFields<MutationUpdateEdgeArgs, 'edgeType' | 'edge'>>;
  updateNode: Resolver<ResolversTypes['UpdateNodeMutationPayload'], ParentType, ContextType, RequireFields<MutationUpdateNodeArgs, 'nodeType' | 'node'>>;
  deleteEdge: Resolver<ResolversTypes['DeleteEdgeMutationPayload'], ParentType, ContextType, RequireFields<MutationDeleteEdgeArgs, 'edgeType' | 'edge'>>;
  deleteNode: Resolver<ResolversTypes['DeleteNodeMutationPayload'], ParentType, ContextType, RequireFields<MutationDeleteNodeArgs, 'nodeType' | 'node'>>;
};

export type CreateNodeMutationPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateNodeMutationPayload'] = ResolversParentTypes['CreateNodeMutationPayload']> = {
  __resolveType: TypeResolveFn<'CreateNodeMutationSuccess' | 'CreateNodeMutationError', ParentType, ContextType>;
};

export type CreateNodeMutationSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateNodeMutationSuccess'] = ResolversParentTypes['CreateNodeMutationSuccess']> = {
  node: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateNodeMutationErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateNodeMutationError'] = ResolversParentTypes['CreateNodeMutationError']> = {
  type: Resolver<ResolversTypes['CreateNodeMutationErrorType'], ParentType, ContextType>;
  details: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateEdgeMutationPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateEdgeMutationPayload'] = ResolversParentTypes['CreateEdgeMutationPayload']> = {
  __resolveType: TypeResolveFn<'CreateEdgeMutationSuccess' | 'CreateEdgeMutationError', ParentType, ContextType>;
};

export type CreateEdgeMutationSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateEdgeMutationSuccess'] = ResolversParentTypes['CreateEdgeMutationSuccess']> = {
  edge: Resolver<Maybe<ResolversTypes['Edge']>, ParentType, ContextType>;
  from: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
  to: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateEdgeMutationErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateEdgeMutationError'] = ResolversParentTypes['CreateEdgeMutationError']> = {
  type: Resolver<ResolversTypes['CreateEdgeMutationErrorType'], ParentType, ContextType>;
  details: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateNodeMutationPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UpdateNodeMutationPayload'] = ResolversParentTypes['UpdateNodeMutationPayload']> = {
  __resolveType: TypeResolveFn<'UpdateNodeMutationSuccess' | 'UpdateNodeMutationError', ParentType, ContextType>;
};

export type UpdateNodeMutationSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UpdateNodeMutationSuccess'] = ResolversParentTypes['UpdateNodeMutationSuccess']> = {
  node: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateNodeMutationErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UpdateNodeMutationError'] = ResolversParentTypes['UpdateNodeMutationError']> = {
  type: Resolver<ResolversTypes['UpdateNodeMutationErrorType'], ParentType, ContextType>;
  details: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateEdgeMutationPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UpdateEdgeMutationPayload'] = ResolversParentTypes['UpdateEdgeMutationPayload']> = {
  __resolveType: TypeResolveFn<'UpdateEdgeMutationSuccess' | 'UpdateEdgeMutationError', ParentType, ContextType>;
};

export type UpdateEdgeMutationSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UpdateEdgeMutationSuccess'] = ResolversParentTypes['UpdateEdgeMutationSuccess']> = {
  edge: Resolver<Maybe<ResolversTypes['Edge']>, ParentType, ContextType>;
  from: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
  to: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateEdgeMutationErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UpdateEdgeMutationError'] = ResolversParentTypes['UpdateEdgeMutationError']> = {
  type: Resolver<ResolversTypes['UpdateEdgeMutationErrorType'], ParentType, ContextType>;
  details: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteEdgeMutationPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteEdgeMutationPayload'] = ResolversParentTypes['DeleteEdgeMutationPayload']> = {
  __resolveType: TypeResolveFn<'DeleteEdgeMutationSuccess' | 'DeleteEdgeMutationError', ParentType, ContextType>;
};

export type DeleteEdgeMutationSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteEdgeMutationSuccess'] = ResolversParentTypes['DeleteEdgeMutationSuccess']> = {
  edge: Resolver<Maybe<ResolversTypes['Edge']>, ParentType, ContextType>;
  from: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
  to: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteEdgeMutationErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteEdgeMutationError'] = ResolversParentTypes['DeleteEdgeMutationError']> = {
  type: Resolver<Maybe<ResolversTypes['DeleteEdgeMutationErrorType']>, ParentType, ContextType>;
  details: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteNodeMutationPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteNodeMutationPayload'] = ResolversParentTypes['DeleteNodeMutationPayload']> = {
  __resolveType: TypeResolveFn<'DeleteNodeMutationSuccess' | 'DeleteNodeMutationError', ParentType, ContextType>;
};

export type DeleteNodeMutationSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteNodeMutationSuccess'] = ResolversParentTypes['DeleteNodeMutationSuccess']> = {
  node: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteNodeMutationErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteNodeMutationError'] = ResolversParentTypes['DeleteNodeMutationError']> = {
  type: Resolver<Maybe<ResolversTypes['DeleteNodeMutationErrorType']>, ParentType, ContextType>;
  details: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Page'] = ResolversParentTypes['Page']> = {
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges: Resolver<Array<ResolversTypes['PageEdge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageEdge'] = ResolversParentTypes['PageEdge']> = {
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  edge: Resolver<ResolversTypes['IEdge'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['INode'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryNodePayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['QueryNodePayload'] = ResolversParentTypes['QueryNodePayload']> = {
  __resolveType: TypeResolveFn<'QueryNodeSuccess' | 'QueryNodeError', ParentType, ContextType>;
};

export type QueryNodeSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['QueryNodeSuccess'] = ResolversParentTypes['QueryNodeSuccess']> = {
  result: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryNodeErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['QueryNodeError'] = ResolversParentTypes['QueryNodeError']> = {
  type: Resolver<ResolversTypes['QueryNodeErrorType'], ParentType, ContextType>;
  details: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  node: Resolver<ResolversTypes['QueryNodePayload'], ParentType, ContextType, RequireFields<QueryNodeArgs, '_id' | 'nodeType'>>;
};

export interface EmptyScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Empty'], any> {
  name: 'Empty';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type INodeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['INode'] = ResolversParentTypes['INode']> = {
  __resolveType: TypeResolveFn<'Subject' | 'User', ParentType, ContextType>;
  _id: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  _meta: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  _rel: Resolver<ResolversTypes['Page'], ParentType, ContextType, RequireFields<INode_RelArgs, 'edge'>>;
};

export type IEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['IEdge'] = ResolversParentTypes['IEdge']> = {
  __resolveType: TypeResolveFn<'Follows', ParentType, ContextType>;
  _id: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  _meta: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
};

export type MetaResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Meta'] = ResolversParentTypes['Meta']> = {
  created: Resolver<ResolversTypes['ByAt'], ParentType, ContextType>;
  lastUpdate: Resolver<ResolversTypes['ByAt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ByAtResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ByAt'] = ResolversParentTypes['ByAt']> = {
  by: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  at: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FollowsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Follows'] = ResolversParentTypes['Follows']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _meta: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Edge'] = ResolversParentTypes['Edge']> = {
  __resolveType: TypeResolveFn<'Follows', ParentType, ContextType>;
};

export type SubjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subject'] = ResolversParentTypes['Subject']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _meta: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  _rel: Resolver<ResolversTypes['Page'], ParentType, ContextType, RequireFields<Subject_RelArgs, 'edge'>>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NodeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'Subject' | 'User', ParentType, ContextType>;
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _meta: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  _rel: Resolver<ResolversTypes['Page'], ParentType, ContextType, RequireFields<User_RelArgs, 'edge'>>;
  role: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  displayName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  Mutation: MutationResolvers<ContextType>;
  CreateNodeMutationPayload: CreateNodeMutationPayloadResolvers<ContextType>;
  CreateNodeMutationSuccess: CreateNodeMutationSuccessResolvers<ContextType>;
  CreateNodeMutationError: CreateNodeMutationErrorResolvers<ContextType>;
  CreateEdgeMutationPayload: CreateEdgeMutationPayloadResolvers<ContextType>;
  CreateEdgeMutationSuccess: CreateEdgeMutationSuccessResolvers<ContextType>;
  CreateEdgeMutationError: CreateEdgeMutationErrorResolvers<ContextType>;
  UpdateNodeMutationPayload: UpdateNodeMutationPayloadResolvers<ContextType>;
  UpdateNodeMutationSuccess: UpdateNodeMutationSuccessResolvers<ContextType>;
  UpdateNodeMutationError: UpdateNodeMutationErrorResolvers<ContextType>;
  UpdateEdgeMutationPayload: UpdateEdgeMutationPayloadResolvers<ContextType>;
  UpdateEdgeMutationSuccess: UpdateEdgeMutationSuccessResolvers<ContextType>;
  UpdateEdgeMutationError: UpdateEdgeMutationErrorResolvers<ContextType>;
  DeleteEdgeMutationPayload: DeleteEdgeMutationPayloadResolvers<ContextType>;
  DeleteEdgeMutationSuccess: DeleteEdgeMutationSuccessResolvers<ContextType>;
  DeleteEdgeMutationError: DeleteEdgeMutationErrorResolvers<ContextType>;
  DeleteNodeMutationPayload: DeleteNodeMutationPayloadResolvers<ContextType>;
  DeleteNodeMutationSuccess: DeleteNodeMutationSuccessResolvers<ContextType>;
  DeleteNodeMutationError: DeleteNodeMutationErrorResolvers<ContextType>;
  Page: PageResolvers<ContextType>;
  PageInfo: PageInfoResolvers<ContextType>;
  PageEdge: PageEdgeResolvers<ContextType>;
  QueryNodePayload: QueryNodePayloadResolvers<ContextType>;
  QueryNodeSuccess: QueryNodeSuccessResolvers<ContextType>;
  QueryNodeError: QueryNodeErrorResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  Empty: GraphQLScalarType;
  DateTime: GraphQLScalarType;
  INode: INodeResolvers<ContextType>;
  IEdge: IEdgeResolvers<ContextType>;
  Meta: MetaResolvers<ContextType>;
  ByAt: ByAtResolvers<ContextType>;
  Follows: FollowsResolvers<ContextType>;
  Edge: EdgeResolvers<ContextType>;
  Subject: SubjectResolvers<ContextType>;
  Node: NodeResolvers<ContextType>;
  User: UserResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = Context> = {
  access: AccessDirectiveResolver<any, any, ContextType>;
};


/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<ContextType = Context> = DirectiveResolvers<ContextType>;