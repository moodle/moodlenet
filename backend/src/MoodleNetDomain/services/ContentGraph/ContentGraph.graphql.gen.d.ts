import { GraphQLResolveInfo } from 'graphql';
import { Context, RootValue } from '../../MoodleNetGraphQL';
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
  cursor: Scalars['String'];
  node: GraphVertex;
};

export type PageInfo = {
  __typename: 'PageInfo';
  endCursor: Maybe<Scalars['String']>;
  hasNextPage: Maybe<Scalars['Boolean']>;
  hasPreviousPage: Maybe<Scalars['Boolean']>;
  startCursor: Maybe<Scalars['String']>;
};

export type Page = {
  pageInfo: PageInfo;
  edges: Array<GraphEdge>;
};

export type PageInput = {
  first: Maybe<Scalars['Int']>;
  after: Maybe<Scalars['String']>;
  before: Maybe<Scalars['String']>;
  last: Maybe<Scalars['Int']>;
};

export type Follows = {
  _id: Scalars['ID'];
  since: Scalars['Int'];
};

export type IUserFollowsSubject = {
  ufs: Scalars['String'];
};

export type UserFollowsSubject = GraphEdge & IUserFollowsSubject & Follows & {
  __typename: 'UserFollowsSubject';
  _id: Scalars['ID'];
  cursor: Scalars['String'];
  ufs: Scalars['String'];
  since: Scalars['Int'];
  node: Subject;
};

export type UserFollowsSubjectPage = Page & {
  __typename: 'UserFollowsSubjectPage';
  pageInfo: PageInfo;
  edges: Array<UserFollowsSubject>;
};

export type SubjectFollower = GraphEdge & IUserFollowsSubject & Follows & {
  __typename: 'SubjectFollower';
  _id: Scalars['ID'];
  cursor: Scalars['String'];
  ufs: Scalars['String'];
  since: Scalars['Int'];
  node: User;
};

export type SubjectFollowersPage = Page & {
  __typename: 'SubjectFollowersPage';
  pageInfo: PageInfo;
  edges: Array<SubjectFollower>;
};

export type User = GraphVertex & {
  __typename: 'User';
  _id: Scalars['ID'];
  displayName: Scalars['String'];
  followers: UserFollowsUserPage;
  followsSubjects: UserFollowsSubjectPage;
  followsUsers: UserFollowsUserPage;
};


export type UserFollowersArgs = {
  page: Maybe<PageInput>;
};


export type UserFollowsSubjectsArgs = {
  page: Maybe<PageInput>;
};


export type UserFollowsUsersArgs = {
  page: Maybe<PageInput>;
};

export type Subject = GraphVertex & {
  __typename: 'Subject';
  _id: Scalars['ID'];
  followers: SubjectFollowersPage;
  name: Scalars['String'];
};


export type SubjectFollowersArgs = {
  page: Maybe<PageInput>;
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

export type IUserFollowsUser = {
  ufu: Scalars['String'];
};

export type UserFollowsUser = GraphEdge & IUserFollowsUser & Follows & {
  __typename: 'UserFollowsUser';
  _id: Scalars['ID'];
  cursor: Scalars['String'];
  node: User;
  since: Scalars['Int'];
  ufu: Scalars['String'];
};

export type UserFollowsUserPage = Page & {
  __typename: 'UserFollowsUserPage';
  pageInfo: PageInfo;
  edges: Array<UserFollowsUser>;
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
  GraphEdge: ResolversTypes['UserFollowsSubject'] | ResolversTypes['SubjectFollower'] | ResolversTypes['UserFollowsUser'];
  String: ResolverTypeWrapper<Scalars['String']>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Page: ResolversTypes['UserFollowsSubjectPage'] | ResolversTypes['SubjectFollowersPage'] | ResolversTypes['UserFollowsUserPage'];
  PageInput: PageInput;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Follows: ResolversTypes['UserFollowsSubject'] | ResolversTypes['SubjectFollower'] | ResolversTypes['UserFollowsUser'];
  IUserFollowsSubject: ResolversTypes['UserFollowsSubject'] | ResolversTypes['SubjectFollower'];
  UserFollowsSubject: ResolverTypeWrapper<UserFollowsSubject>;
  UserFollowsSubjectPage: ResolverTypeWrapper<UserFollowsSubjectPage>;
  SubjectFollower: ResolverTypeWrapper<SubjectFollower>;
  SubjectFollowersPage: ResolverTypeWrapper<SubjectFollowersPage>;
  User: ResolverTypeWrapper<User>;
  Subject: ResolverTypeWrapper<Subject>;
  Mutation: ResolverTypeWrapper<RootValue>;
  IUserFollowsUser: ResolversTypes['UserFollowsUser'];
  UserFollowsUser: ResolverTypeWrapper<UserFollowsUser>;
  UserFollowsUserPage: ResolverTypeWrapper<UserFollowsUserPage>;
  CreateSubjectInput: CreateSubjectInput;
  Query: ResolverTypeWrapper<RootValue>;
  CreateUserInput: CreateUserInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  GraphVertex: ResolversParentTypes['User'] | ResolversParentTypes['Subject'];
  ID: Scalars['ID'];
  GraphEdge: ResolversParentTypes['UserFollowsSubject'] | ResolversParentTypes['SubjectFollower'] | ResolversParentTypes['UserFollowsUser'];
  String: Scalars['String'];
  PageInfo: PageInfo;
  Boolean: Scalars['Boolean'];
  Page: ResolversParentTypes['UserFollowsSubjectPage'] | ResolversParentTypes['SubjectFollowersPage'] | ResolversParentTypes['UserFollowsUserPage'];
  PageInput: PageInput;
  Int: Scalars['Int'];
  Follows: ResolversParentTypes['UserFollowsSubject'] | ResolversParentTypes['SubjectFollower'] | ResolversParentTypes['UserFollowsUser'];
  IUserFollowsSubject: ResolversParentTypes['UserFollowsSubject'] | ResolversParentTypes['SubjectFollower'];
  UserFollowsSubject: UserFollowsSubject;
  UserFollowsSubjectPage: UserFollowsSubjectPage;
  SubjectFollower: SubjectFollower;
  SubjectFollowersPage: SubjectFollowersPage;
  User: User;
  Subject: Subject;
  Mutation: RootValue;
  IUserFollowsUser: ResolversParentTypes['UserFollowsUser'];
  UserFollowsUser: UserFollowsUser;
  UserFollowsUserPage: UserFollowsUserPage;
  CreateSubjectInput: CreateSubjectInput;
  Query: RootValue;
  CreateUserInput: CreateUserInput;
};

export type GraphVertexResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GraphVertex'] = ResolversParentTypes['GraphVertex']> = {
  __resolveType: TypeResolveFn<'User' | 'Subject', ParentType, ContextType>;
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type GraphEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GraphEdge'] = ResolversParentTypes['GraphEdge']> = {
  __resolveType: TypeResolveFn<'UserFollowsSubject' | 'SubjectFollower' | 'UserFollowsUser', ParentType, ContextType>;
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['GraphVertex'], ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  hasPreviousPage: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  startCursor: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Page'] = ResolversParentTypes['Page']> = {
  __resolveType: TypeResolveFn<'UserFollowsSubjectPage' | 'SubjectFollowersPage' | 'UserFollowsUserPage', ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges: Resolver<Array<ResolversTypes['GraphEdge']>, ParentType, ContextType>;
};

export type FollowsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Follows'] = ResolversParentTypes['Follows']> = {
  __resolveType: TypeResolveFn<'UserFollowsSubject' | 'SubjectFollower' | 'UserFollowsUser', ParentType, ContextType>;
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  since: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type IUserFollowsSubjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['IUserFollowsSubject'] = ResolversParentTypes['IUserFollowsSubject']> = {
  __resolveType: TypeResolveFn<'UserFollowsSubject' | 'SubjectFollower', ParentType, ContextType>;
  ufs: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type UserFollowsSubjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserFollowsSubject'] = ResolversParentTypes['UserFollowsSubject']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ufs: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  since: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['Subject'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserFollowsSubjectPageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserFollowsSubjectPage'] = ResolversParentTypes['UserFollowsSubjectPage']> = {
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges: Resolver<Array<ResolversTypes['UserFollowsSubject']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubjectFollowerResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubjectFollower'] = ResolversParentTypes['SubjectFollower']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ufs: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  since: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubjectFollowersPageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubjectFollowersPage'] = ResolversParentTypes['SubjectFollowersPage']> = {
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges: Resolver<Array<ResolversTypes['SubjectFollower']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  displayName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  followers: Resolver<ResolversTypes['UserFollowsUserPage'], ParentType, ContextType, RequireFields<UserFollowersArgs, never>>;
  followsSubjects: Resolver<ResolversTypes['UserFollowsSubjectPage'], ParentType, ContextType, RequireFields<UserFollowsSubjectsArgs, never>>;
  followsUsers: Resolver<ResolversTypes['UserFollowsUserPage'], ParentType, ContextType, RequireFields<UserFollowsUsersArgs, never>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subject'] = ResolversParentTypes['Subject']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  followers: Resolver<ResolversTypes['SubjectFollowersPage'], ParentType, ContextType, RequireFields<SubjectFollowersArgs, never>>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createSubject: Resolver<Maybe<ResolversTypes['Subject']>, ParentType, ContextType, RequireFields<MutationCreateSubjectArgs, 'subjectInput'>>;
  createUser: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'user'>>;
  followSubject: Resolver<Maybe<ResolversTypes['UserFollowsSubject']>, ParentType, ContextType, RequireFields<MutationFollowSubjectArgs, never>>;
  followUser: Resolver<Maybe<ResolversTypes['UserFollowsUser']>, ParentType, ContextType, RequireFields<MutationFollowUserArgs, never>>;
};

export type IUserFollowsUserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['IUserFollowsUser'] = ResolversParentTypes['IUserFollowsUser']> = {
  __resolveType: TypeResolveFn<'UserFollowsUser', ParentType, ContextType>;
  ufu: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type UserFollowsUserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserFollowsUser'] = ResolversParentTypes['UserFollowsUser']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  since: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ufu: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserFollowsUserPageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserFollowsUserPage'] = ResolversParentTypes['UserFollowsUserPage']> = {
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges: Resolver<Array<ResolversTypes['UserFollowsUser']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  subject: Resolver<Maybe<ResolversTypes['Subject']>, ParentType, ContextType, RequireFields<QuerySubjectArgs, '_id'>>;
  user: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, '_id'>>;
};

export type Resolvers<ContextType = Context> = {
  GraphVertex: GraphVertexResolvers<ContextType>;
  GraphEdge: GraphEdgeResolvers<ContextType>;
  PageInfo: PageInfoResolvers<ContextType>;
  Page: PageResolvers<ContextType>;
  Follows: FollowsResolvers<ContextType>;
  IUserFollowsSubject: IUserFollowsSubjectResolvers<ContextType>;
  UserFollowsSubject: UserFollowsSubjectResolvers<ContextType>;
  UserFollowsSubjectPage: UserFollowsSubjectPageResolvers<ContextType>;
  SubjectFollower: SubjectFollowerResolvers<ContextType>;
  SubjectFollowersPage: SubjectFollowersPageResolvers<ContextType>;
  User: UserResolvers<ContextType>;
  Subject: SubjectResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  IUserFollowsUser: IUserFollowsUserResolvers<ContextType>;
  UserFollowsUser: UserFollowsUserResolvers<ContextType>;
  UserFollowsUserPage: UserFollowsUserPageResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
