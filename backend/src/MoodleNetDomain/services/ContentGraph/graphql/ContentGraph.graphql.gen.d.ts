import { GraphQLResolveInfo } from 'graphql';
import { Context, RootValue } from '../../../MoodleNetGraphQL';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type GraphVertex = {
  _id: Scalars['ID'];
};

export type GraphEdge = {
  _id: Scalars['ID'];
  _from: Maybe<GraphVertex>;
  _to: Maybe<GraphVertex>;
};

export type RelayPageEdge = {
  cursor: Scalars['String'];
  node: Maybe<GraphEdge>;
};

export type RelayPageInfo = {
  __typename: 'RelayPageInfo';
  endCursor: Maybe<Scalars['String']>;
  hasNextPage: Maybe<Scalars['Boolean']>;
  hasPreviousPage: Maybe<Scalars['Boolean']>;
  startCursor: Maybe<Scalars['String']>;
};

export type RelayPage = {
  pageInfo: RelayPageInfo;
  edges: Array<RelayPageEdge>;
};

export type RelayPageInput = {
  first: Maybe<Scalars['Int']>;
  after: Maybe<Scalars['String']>;
  before: Maybe<Scalars['String']>;
  last: Maybe<Scalars['Int']>;
};

export type UserFollowsSubject = GraphEdge & {
  __typename: 'UserFollowsSubject';
  _id: Scalars['ID'];
  _from: Maybe<User>;
  _to: Maybe<Subject>;
};

export type UserFollowsSubjectRelayEdge = RelayPageEdge & {
  __typename: 'UserFollowsSubjectRelayEdge';
  cursor: Scalars['String'];
  node: Maybe<UserFollowsSubject>;
};

export type UserFollowsSubjectRelayPage = RelayPage & {
  __typename: 'UserFollowsSubjectRelayPage';
  pageInfo: RelayPageInfo;
  edges: Array<UserFollowsSubjectRelayEdge>;
};

export type User = GraphVertex & {
  __typename: 'User';
  _id: Scalars['ID'];
  followers: UserFollowsUserRelayPage;
  followsSubjects: Array<UserFollowsSubject>;
  followsUsers: UserFollowsUserRelayPage;
  name: Scalars['String'];
};


export type UserFollowersArgs = {
  page: Maybe<RelayPageInput>;
};


export type UserFollowsSubjectsArgs = {
  page: Maybe<RelayPageInput>;
};


export type UserFollowsUsersArgs = {
  page: Maybe<RelayPageInput>;
};

export type Subject = GraphVertex & {
  __typename: 'Subject';
  _id: Scalars['ID'];
  followers: Array<UserFollowsSubject>;
  name: Scalars['String'];
};


export type SubjectFollowersArgs = {
  page: Maybe<RelayPageInput>;
};

export type Mutation = {
  __typename: 'Mutation';
  createSubject: Maybe<Subject>;
  createUser: User;
  followSubject: Maybe<UserFollowsSubject>;
  followUser: Maybe<UserFollowsUser>;
};


export type MutationCreateSubjectArgs = {
  subjectInput: CreateSubjectInput;
};


export type MutationCreateUserArgs = {
  user: CreateUserInput;
};


export type MutationFollowSubjectArgs = {
  subjectId: Maybe<Scalars['ID']>;
};


export type MutationFollowUserArgs = {
  userId: Maybe<Scalars['ID']>;
};

export type UserFollowsUser = GraphEdge & {
  __typename: 'UserFollowsUser';
  _id: Scalars['ID'];
  _from: Maybe<User>;
  _to: Maybe<User>;
};

export type UserFollowsUserRelayEdge = RelayPageEdge & {
  __typename: 'UserFollowsUserRelayEdge';
  cursor: Scalars['String'];
  node: Maybe<UserFollowsUser>;
};

export type UserFollowsUserRelayPage = RelayPage & {
  __typename: 'UserFollowsUserRelayPage';
  pageInfo: RelayPageInfo;
  edges: Array<UserFollowsUserRelayEdge>;
};

export type CreateSubjectInput = {
  name: Scalars['String'];
};

export type Query = {
  __typename: 'Query';
  subject: Maybe<Subject>;
  user: Maybe<User>;
};


export type QuerySubjectArgs = {
  _id: Scalars['ID'];
};


export type QueryUserArgs = {
  _id: Scalars['ID'];
};

export type CreateUserInput = {
  name: Maybe<Scalars['String']>;
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
  GraphVertex: ResolversTypes['User'] | ResolversTypes['Subject'];
  ID: ResolverTypeWrapper<Scalars['ID']>;
  GraphEdge: ResolversTypes['UserFollowsSubject'] | ResolversTypes['UserFollowsUser'];
  RelayPageEdge: ResolversTypes['UserFollowsSubjectRelayEdge'] | ResolversTypes['UserFollowsUserRelayEdge'];
  String: ResolverTypeWrapper<Scalars['String']>;
  RelayPageInfo: ResolverTypeWrapper<RelayPageInfo>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  RelayPage: ResolversTypes['UserFollowsSubjectRelayPage'] | ResolversTypes['UserFollowsUserRelayPage'];
  RelayPageInput: RelayPageInput;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  UserFollowsSubject: ResolverTypeWrapper<UserFollowsSubject>;
  UserFollowsSubjectRelayEdge: ResolverTypeWrapper<UserFollowsSubjectRelayEdge>;
  UserFollowsSubjectRelayPage: ResolverTypeWrapper<UserFollowsSubjectRelayPage>;
  User: ResolverTypeWrapper<User>;
  Subject: ResolverTypeWrapper<Subject>;
  Mutation: ResolverTypeWrapper<RootValue>;
  UserFollowsUser: ResolverTypeWrapper<UserFollowsUser>;
  UserFollowsUserRelayEdge: ResolverTypeWrapper<UserFollowsUserRelayEdge>;
  UserFollowsUserRelayPage: ResolverTypeWrapper<UserFollowsUserRelayPage>;
  CreateSubjectInput: CreateSubjectInput;
  Query: ResolverTypeWrapper<RootValue>;
  CreateUserInput: CreateUserInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  GraphVertex: ResolversParentTypes['User'] | ResolversParentTypes['Subject'];
  ID: Scalars['ID'];
  GraphEdge: ResolversParentTypes['UserFollowsSubject'] | ResolversParentTypes['UserFollowsUser'];
  RelayPageEdge: ResolversParentTypes['UserFollowsSubjectRelayEdge'] | ResolversParentTypes['UserFollowsUserRelayEdge'];
  String: Scalars['String'];
  RelayPageInfo: RelayPageInfo;
  Boolean: Scalars['Boolean'];
  RelayPage: ResolversParentTypes['UserFollowsSubjectRelayPage'] | ResolversParentTypes['UserFollowsUserRelayPage'];
  RelayPageInput: RelayPageInput;
  Int: Scalars['Int'];
  UserFollowsSubject: UserFollowsSubject;
  UserFollowsSubjectRelayEdge: UserFollowsSubjectRelayEdge;
  UserFollowsSubjectRelayPage: UserFollowsSubjectRelayPage;
  User: User;
  Subject: Subject;
  Mutation: RootValue;
  UserFollowsUser: UserFollowsUser;
  UserFollowsUserRelayEdge: UserFollowsUserRelayEdge;
  UserFollowsUserRelayPage: UserFollowsUserRelayPage;
  CreateSubjectInput: CreateSubjectInput;
  Query: RootValue;
  CreateUserInput: CreateUserInput;
};

export type GraphVertexResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GraphVertex'] = ResolversParentTypes['GraphVertex']> = {
  __resolveType: TypeResolveFn<'User' | 'Subject', ParentType, ContextType>;
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type GraphEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GraphEdge'] = ResolversParentTypes['GraphEdge']> = {
  __resolveType: TypeResolveFn<'UserFollowsSubject' | 'UserFollowsUser', ParentType, ContextType>;
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _from: Resolver<Maybe<ResolversTypes['GraphVertex']>, ParentType, ContextType>;
  _to: Resolver<Maybe<ResolversTypes['GraphVertex']>, ParentType, ContextType>;
};

export type RelayPageEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RelayPageEdge'] = ResolversParentTypes['RelayPageEdge']> = {
  __resolveType: TypeResolveFn<'UserFollowsSubjectRelayEdge' | 'UserFollowsUserRelayEdge', ParentType, ContextType>;
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<Maybe<ResolversTypes['GraphEdge']>, ParentType, ContextType>;
};

export type RelayPageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RelayPageInfo'] = ResolversParentTypes['RelayPageInfo']> = {
  endCursor: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  hasPreviousPage: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  startCursor: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RelayPageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RelayPage'] = ResolversParentTypes['RelayPage']> = {
  __resolveType: TypeResolveFn<'UserFollowsSubjectRelayPage' | 'UserFollowsUserRelayPage', ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['RelayPageInfo'], ParentType, ContextType>;
  edges: Resolver<Array<ResolversTypes['RelayPageEdge']>, ParentType, ContextType>;
};

export type UserFollowsSubjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserFollowsSubject'] = ResolversParentTypes['UserFollowsSubject']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _from: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  _to: Resolver<Maybe<ResolversTypes['Subject']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserFollowsSubjectRelayEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserFollowsSubjectRelayEdge'] = ResolversParentTypes['UserFollowsSubjectRelayEdge']> = {
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<Maybe<ResolversTypes['UserFollowsSubject']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserFollowsSubjectRelayPageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserFollowsSubjectRelayPage'] = ResolversParentTypes['UserFollowsSubjectRelayPage']> = {
  pageInfo: Resolver<ResolversTypes['RelayPageInfo'], ParentType, ContextType>;
  edges: Resolver<Array<ResolversTypes['UserFollowsSubjectRelayEdge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  followers: Resolver<ResolversTypes['UserFollowsUserRelayPage'], ParentType, ContextType, RequireFields<UserFollowersArgs, never>>;
  followsSubjects: Resolver<Array<ResolversTypes['UserFollowsSubject']>, ParentType, ContextType, RequireFields<UserFollowsSubjectsArgs, never>>;
  followsUsers: Resolver<ResolversTypes['UserFollowsUserRelayPage'], ParentType, ContextType, RequireFields<UserFollowsUsersArgs, never>>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subject'] = ResolversParentTypes['Subject']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  followers: Resolver<Array<ResolversTypes['UserFollowsSubject']>, ParentType, ContextType, RequireFields<SubjectFollowersArgs, never>>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createSubject: Resolver<Maybe<ResolversTypes['Subject']>, ParentType, ContextType, RequireFields<MutationCreateSubjectArgs, 'subjectInput'>>;
  createUser: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'user'>>;
  followSubject: Resolver<Maybe<ResolversTypes['UserFollowsSubject']>, ParentType, ContextType, RequireFields<MutationFollowSubjectArgs, never>>;
  followUser: Resolver<Maybe<ResolversTypes['UserFollowsUser']>, ParentType, ContextType, RequireFields<MutationFollowUserArgs, never>>;
};

export type UserFollowsUserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserFollowsUser'] = ResolversParentTypes['UserFollowsUser']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _from: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  _to: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserFollowsUserRelayEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserFollowsUserRelayEdge'] = ResolversParentTypes['UserFollowsUserRelayEdge']> = {
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<Maybe<ResolversTypes['UserFollowsUser']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserFollowsUserRelayPageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserFollowsUserRelayPage'] = ResolversParentTypes['UserFollowsUserRelayPage']> = {
  pageInfo: Resolver<ResolversTypes['RelayPageInfo'], ParentType, ContextType>;
  edges: Resolver<Array<ResolversTypes['UserFollowsUserRelayEdge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  subject: Resolver<Maybe<ResolversTypes['Subject']>, ParentType, ContextType, RequireFields<QuerySubjectArgs, '_id'>>;
  user: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, '_id'>>;
};

export type Resolvers<ContextType = Context> = {
  GraphVertex: GraphVertexResolvers<ContextType>;
  GraphEdge: GraphEdgeResolvers<ContextType>;
  RelayPageEdge: RelayPageEdgeResolvers<ContextType>;
  RelayPageInfo: RelayPageInfoResolvers<ContextType>;
  RelayPage: RelayPageResolvers<ContextType>;
  UserFollowsSubject: UserFollowsSubjectResolvers<ContextType>;
  UserFollowsSubjectRelayEdge: UserFollowsSubjectRelayEdgeResolvers<ContextType>;
  UserFollowsSubjectRelayPage: UserFollowsSubjectRelayPageResolvers<ContextType>;
  User: UserResolvers<ContextType>;
  Subject: SubjectResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  UserFollowsUser: UserFollowsUserResolvers<ContextType>;
  UserFollowsUserRelayEdge: UserFollowsUserRelayEdgeResolvers<ContextType>;
  UserFollowsUserRelayPage: UserFollowsUserRelayPageResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
