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
  Empty: any;
  Date: any;
};


export enum AccessLevel {
  Admin = 'ADMIN',
  User = 'USER',
  Owner = 'OWNER'
}

export type INode = {
  _id: Maybe<Scalars['ID']>;
  _meta: Meta;
  _edges: Maybe<Page>;
};


export type INode_EdgesArgs = {
  type: Array<EdgeTypeInput>;
  page: Maybe<PageInput>;
};

export type IEdge = {
  _id: Maybe<Scalars['ID']>;
  _meta: Meta;
  _from: INode;
  _to: INode;
};

export type EdgeTypeInput = {
  name: EdgeName;
  node: NodeName;
  rev: Maybe<Scalars['Boolean']>;
};

export enum NodeName {
  Subject = 'Subject',
  User = 'User',
  None = '_none'
}

export enum EdgeName {
  Follows = 'Follows',
  None = '_none'
}

export type Author = User;

export type Meta = {
  __typename: 'Meta';
  created: ByAt;
  lastUpdate: ByAt;
};

export type ByAt = {
  __typename: 'ByAt';
  by: Author;
  at: Scalars['Int'];
};

export type NodeMutationPayload = NodeMutationError | Subject | User;

export enum NodeMutationErrorType {
  NotFound = 'NotFound',
  NotAuthorized = 'NotAuthorized',
  UnexpectedInput = 'UnexpectedInput'
}

export type NodeMutationError = {
  __typename: 'NodeMutationError';
  error: NodeMutationErrorType;
  details: Maybe<Scalars['String']>;
};

export type EdgeMutationPayload = EdgeMutationError | Follows;

export enum EdgeMutationErrorType {
  NotFound = 'NotFound',
  NotAuthorized = 'NotAuthorized',
  UnexpectedInput = 'UnexpectedInput'
}

export type EdgeMutationError = {
  __typename: 'EdgeMutationError';
  error: EdgeMutationErrorType;
  details: Maybe<Scalars['String']>;
};

export enum DeleteErrorType {
  NotFound = 'NotFound',
  NotAuthorized = 'NotAuthorized'
}

export type DeletePayload = {
  __typename: 'DeletePayload';
  error: Maybe<DeleteErrorType>;
  details: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename: 'Mutation';
  createEdge: EdgeMutationPayload;
  createNode: NodeMutationPayload;
  updateEdge: EdgeMutationPayload;
  updateNode: NodeMutationPayload;
  delete: DeletePayload;
};


export type MutationCreateEdgeArgs = {
  edge: CreateEdgeInput;
};


export type MutationCreateNodeArgs = {
  node: CreateNodeInput;
};


export type MutationUpdateEdgeArgs = {
  edge: UpdateEdgeInput;
};


export type MutationUpdateNodeArgs = {
  node: UpdateNodeInput;
};


export type MutationDeleteArgs = {
  _id: Scalars['ID'];
};

export type CreateNodeInput = {
  Subject: Maybe<CreateSubjectInput>;
  _: Maybe<Scalars['Empty']>;
};

export type CreateEdgeInput = {
  Follows: Maybe<Scalars['Empty']>;
  _from: Scalars['ID'];
  _to: Scalars['ID'];
};

export type UpdateNodeInput = {
  Subject: Maybe<UpdateSubjectInput>;
  User: Maybe<UpdateUserInput>;
  _id: Scalars['ID'];
};

export type UpdateEdgeInput = {
  _id: Scalars['ID'];
};

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

export type NodeQueryPayload = NodeQueryError | Subject | User;

export enum NodeQueryErrorType {
  NotFound = 'NotFound',
  NotAuthorized = 'NotAuthorized'
}

export type NodeQueryError = {
  __typename: 'NodeQueryError';
  error: NodeQueryErrorType;
  details: Maybe<Scalars['String']>;
};

export type Query = {
  __typename: 'Query';
  node: NodeQueryPayload;
};


export type QueryNodeArgs = {
  _id: Maybe<Scalars['ID']>;
};



export type Follows = IEdge & {
  __typename: 'Follows';
  _id: Scalars['ID'];
  _meta: Meta;
  _from: INode;
  _to: INode;
};

export type Subject = INode & {
  __typename: 'Subject';
  _id: Scalars['ID'];
  _meta: Meta;
  _edges: Maybe<Page>;
  name: Scalars['String'];
};


export type Subject_EdgesArgs = {
  type: Array<EdgeTypeInput>;
  page: Maybe<PageInput>;
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
  _edges: Maybe<Page>;
  displayName: Scalars['String'];
};


export type User_EdgesArgs = {
  type: Array<EdgeTypeInput>;
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
  INode: ResolversTypes['Subject'] | ResolversTypes['User'];
  ID: ResolverTypeWrapper<Scalars['ID']>;
  IEdge: ResolversTypes['Follows'];
  EdgeTypeInput: EdgeTypeInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  NodeName: NodeName;
  EdgeName: EdgeName;
  Author: ResolversTypes['User'];
  Meta: ResolverTypeWrapper<Meta>;
  ByAt: ResolverTypeWrapper<Omit<ByAt, 'by'> & { by: ResolversTypes['Author'] }>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  NodeMutationPayload: ResolversTypes['NodeMutationError'] | ResolversTypes['Subject'] | ResolversTypes['User'];
  NodeMutationErrorType: NodeMutationErrorType;
  NodeMutationError: ResolverTypeWrapper<NodeMutationError>;
  String: ResolverTypeWrapper<Scalars['String']>;
  EdgeMutationPayload: ResolversTypes['EdgeMutationError'] | ResolversTypes['Follows'];
  EdgeMutationErrorType: EdgeMutationErrorType;
  EdgeMutationError: ResolverTypeWrapper<EdgeMutationError>;
  DeleteErrorType: DeleteErrorType;
  DeletePayload: ResolverTypeWrapper<DeletePayload>;
  Mutation: ResolverTypeWrapper<RootValue>;
  CreateNodeInput: CreateNodeInput;
  CreateEdgeInput: CreateEdgeInput;
  UpdateNodeInput: UpdateNodeInput;
  UpdateEdgeInput: UpdateEdgeInput;
  Page: ResolverTypeWrapper<Page>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PageEdge: ResolverTypeWrapper<PageEdge>;
  PageInput: PageInput;
  NodeQueryPayload: ResolversTypes['NodeQueryError'] | ResolversTypes['Subject'] | ResolversTypes['User'];
  NodeQueryErrorType: NodeQueryErrorType;
  NodeQueryError: ResolverTypeWrapper<NodeQueryError>;
  Query: ResolverTypeWrapper<RootValue>;
  Empty: ResolverTypeWrapper<Scalars['Empty']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Follows: ResolverTypeWrapper<Follows>;
  Subject: ResolverTypeWrapper<Subject>;
  CreateSubjectInput: CreateSubjectInput;
  UpdateSubjectInput: UpdateSubjectInput;
  User: ResolverTypeWrapper<User>;
  UpdateUserInput: UpdateUserInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  INode: ResolversParentTypes['Subject'] | ResolversParentTypes['User'];
  ID: Scalars['ID'];
  IEdge: ResolversParentTypes['Follows'];
  EdgeTypeInput: EdgeTypeInput;
  Boolean: Scalars['Boolean'];
  Author: ResolversParentTypes['User'];
  Meta: Meta;
  ByAt: Omit<ByAt, 'by'> & { by: ResolversParentTypes['Author'] };
  Int: Scalars['Int'];
  NodeMutationPayload: ResolversParentTypes['NodeMutationError'] | ResolversParentTypes['Subject'] | ResolversParentTypes['User'];
  NodeMutationError: NodeMutationError;
  String: Scalars['String'];
  EdgeMutationPayload: ResolversParentTypes['EdgeMutationError'] | ResolversParentTypes['Follows'];
  EdgeMutationError: EdgeMutationError;
  DeletePayload: DeletePayload;
  Mutation: RootValue;
  CreateNodeInput: CreateNodeInput;
  CreateEdgeInput: CreateEdgeInput;
  UpdateNodeInput: UpdateNodeInput;
  UpdateEdgeInput: UpdateEdgeInput;
  Page: Page;
  PageInfo: PageInfo;
  PageEdge: PageEdge;
  PageInput: PageInput;
  NodeQueryPayload: ResolversParentTypes['NodeQueryError'] | ResolversParentTypes['Subject'] | ResolversParentTypes['User'];
  NodeQueryError: NodeQueryError;
  Query: RootValue;
  Empty: Scalars['Empty'];
  Date: Scalars['Date'];
  Follows: Follows;
  Subject: Subject;
  CreateSubjectInput: CreateSubjectInput;
  UpdateSubjectInput: UpdateSubjectInput;
  User: User;
  UpdateUserInput: UpdateUserInput;
};

export type AccessDirectiveArgs = {   level: Array<AccessLevel>; };

export type AccessDirectiveResolver<Result, Parent, ContextType = Context, Args = AccessDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type INodeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['INode'] = ResolversParentTypes['INode']> = {
  __resolveType: TypeResolveFn<'Subject' | 'User', ParentType, ContextType>;
  _id: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  _meta: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  _edges: Resolver<Maybe<ResolversTypes['Page']>, ParentType, ContextType, RequireFields<INode_EdgesArgs, 'type'>>;
};

export type IEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['IEdge'] = ResolversParentTypes['IEdge']> = {
  __resolveType: TypeResolveFn<'Follows', ParentType, ContextType>;
  _id: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  _meta: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  _from: Resolver<ResolversTypes['INode'], ParentType, ContextType>;
  _to: Resolver<ResolversTypes['INode'], ParentType, ContextType>;
};

export type AuthorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Author'] = ResolversParentTypes['Author']> = {
  __resolveType: TypeResolveFn<'User', ParentType, ContextType>;
};

export type MetaResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Meta'] = ResolversParentTypes['Meta']> = {
  created: Resolver<ResolversTypes['ByAt'], ParentType, ContextType>;
  lastUpdate: Resolver<ResolversTypes['ByAt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ByAtResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ByAt'] = ResolversParentTypes['ByAt']> = {
  by: Resolver<ResolversTypes['Author'], ParentType, ContextType>;
  at: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NodeMutationPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NodeMutationPayload'] = ResolversParentTypes['NodeMutationPayload']> = {
  __resolveType: TypeResolveFn<'NodeMutationError' | 'Subject' | 'User', ParentType, ContextType>;
};

export type NodeMutationErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NodeMutationError'] = ResolversParentTypes['NodeMutationError']> = {
  error: Resolver<ResolversTypes['NodeMutationErrorType'], ParentType, ContextType>;
  details: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EdgeMutationPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EdgeMutationPayload'] = ResolversParentTypes['EdgeMutationPayload']> = {
  __resolveType: TypeResolveFn<'EdgeMutationError' | 'Follows', ParentType, ContextType>;
};

export type EdgeMutationErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EdgeMutationError'] = ResolversParentTypes['EdgeMutationError']> = {
  error: Resolver<ResolversTypes['EdgeMutationErrorType'], ParentType, ContextType>;
  details: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeletePayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeletePayload'] = ResolversParentTypes['DeletePayload']> = {
  error: Resolver<Maybe<ResolversTypes['DeleteErrorType']>, ParentType, ContextType>;
  details: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createEdge: Resolver<ResolversTypes['EdgeMutationPayload'], ParentType, ContextType, RequireFields<MutationCreateEdgeArgs, 'edge'>>;
  createNode: Resolver<ResolversTypes['NodeMutationPayload'], ParentType, ContextType, RequireFields<MutationCreateNodeArgs, 'node'>>;
  updateEdge: Resolver<ResolversTypes['EdgeMutationPayload'], ParentType, ContextType, RequireFields<MutationUpdateEdgeArgs, 'edge'>>;
  updateNode: Resolver<ResolversTypes['NodeMutationPayload'], ParentType, ContextType, RequireFields<MutationUpdateNodeArgs, 'node'>>;
  delete: Resolver<ResolversTypes['DeletePayload'], ParentType, ContextType, RequireFields<MutationDeleteArgs, '_id'>>;
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

export type NodeQueryPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NodeQueryPayload'] = ResolversParentTypes['NodeQueryPayload']> = {
  __resolveType: TypeResolveFn<'NodeQueryError' | 'Subject' | 'User', ParentType, ContextType>;
};

export type NodeQueryErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NodeQueryError'] = ResolversParentTypes['NodeQueryError']> = {
  error: Resolver<ResolversTypes['NodeQueryErrorType'], ParentType, ContextType>;
  details: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  node: Resolver<ResolversTypes['NodeQueryPayload'], ParentType, ContextType, RequireFields<QueryNodeArgs, never>>;
};

export interface EmptyScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Empty'], any> {
  name: 'Empty';
}

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type FollowsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Follows'] = ResolversParentTypes['Follows']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _meta: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  _from: Resolver<ResolversTypes['INode'], ParentType, ContextType>;
  _to: Resolver<ResolversTypes['INode'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subject'] = ResolversParentTypes['Subject']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _meta: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  _edges: Resolver<Maybe<ResolversTypes['Page']>, ParentType, ContextType, RequireFields<Subject_EdgesArgs, 'type'>>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _meta: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  _edges: Resolver<Maybe<ResolversTypes['Page']>, ParentType, ContextType, RequireFields<User_EdgesArgs, 'type'>>;
  displayName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  INode: INodeResolvers<ContextType>;
  IEdge: IEdgeResolvers<ContextType>;
  Author: AuthorResolvers<ContextType>;
  Meta: MetaResolvers<ContextType>;
  ByAt: ByAtResolvers<ContextType>;
  NodeMutationPayload: NodeMutationPayloadResolvers<ContextType>;
  NodeMutationError: NodeMutationErrorResolvers<ContextType>;
  EdgeMutationPayload: EdgeMutationPayloadResolvers<ContextType>;
  EdgeMutationError: EdgeMutationErrorResolvers<ContextType>;
  DeletePayload: DeletePayloadResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  Page: PageResolvers<ContextType>;
  PageInfo: PageInfoResolvers<ContextType>;
  PageEdge: PageEdgeResolvers<ContextType>;
  NodeQueryPayload: NodeQueryPayloadResolvers<ContextType>;
  NodeQueryError: NodeQueryErrorResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  Empty: GraphQLScalarType;
  Date: GraphQLScalarType;
  Follows: FollowsResolvers<ContextType>;
  Subject: SubjectResolvers<ContextType>;
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