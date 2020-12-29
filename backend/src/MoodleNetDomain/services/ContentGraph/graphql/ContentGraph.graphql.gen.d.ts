import { GraphQLResolveInfo } from 'graphql';
import { MoodleNetGraphQLContext, MoodleNetGraphQLRootValue } from '../../../MoodleNetDomain';
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

export type Vertex = {
  _id: Scalars['ID'];
};

export type Edge = {
  _id: Scalars['ID'];
  _from: Maybe<Vertex>;
  _to: Maybe<Vertex>;
};

export enum CursorDir {
  After = 'after',
  Before = 'before',
  Middle = 'middle'
}

export type InputCursor = {
  _id: Scalars['ID'];
  dir: CursorDir;
};

export type PageInput = {
  limit: Maybe<Scalars['Int']>;
  cursor: Maybe<InputCursor>;
};

export type UserFollowsSubject = Edge & {
  __typename: 'UserFollowsSubject';
  _id: Scalars['ID'];
  _from: Maybe<User>;
  _to: Maybe<Subject>;
};

export type User = Vertex & {
  __typename: 'User';
  _id: Scalars['ID'];
  followers: Array<UserFollowsUser>;
  followsSubjects: Array<UserFollowsSubject>;
  followsUsers: Array<UserFollowsUser>;
  name: Scalars['String'];
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

export type Subject = Vertex & {
  __typename: 'Subject';
  _id: Scalars['ID'];
  followers: Array<UserFollowsSubject>;
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

export type UserFollowsUser = Edge & {
  __typename: 'UserFollowsUser';
  _id: Scalars['ID'];
  _from: Maybe<User>;
  _to: Maybe<User>;
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
  Vertex: ResolversTypes['User'] | ResolversTypes['Subject'];
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Edge: ResolversTypes['UserFollowsSubject'] | ResolversTypes['UserFollowsUser'];
  CursorDir: CursorDir;
  InputCursor: InputCursor;
  PageInput: PageInput;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  UserFollowsSubject: ResolverTypeWrapper<UserFollowsSubject>;
  User: ResolverTypeWrapper<User>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subject: ResolverTypeWrapper<Subject>;
  Mutation: ResolverTypeWrapper<MoodleNetGraphQLRootValue>;
  UserFollowsUser: ResolverTypeWrapper<UserFollowsUser>;
  CreateSubjectInput: CreateSubjectInput;
  Query: ResolverTypeWrapper<MoodleNetGraphQLRootValue>;
  CreateUserInput: CreateUserInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Vertex: ResolversParentTypes['User'] | ResolversParentTypes['Subject'];
  ID: Scalars['ID'];
  Edge: ResolversParentTypes['UserFollowsSubject'] | ResolversParentTypes['UserFollowsUser'];
  InputCursor: InputCursor;
  PageInput: PageInput;
  Int: Scalars['Int'];
  UserFollowsSubject: UserFollowsSubject;
  User: User;
  String: Scalars['String'];
  Subject: Subject;
  Mutation: MoodleNetGraphQLRootValue;
  UserFollowsUser: UserFollowsUser;
  CreateSubjectInput: CreateSubjectInput;
  Query: MoodleNetGraphQLRootValue;
  CreateUserInput: CreateUserInput;
  Boolean: Scalars['Boolean'];
};

export type VertexResolvers<ContextType = MoodleNetGraphQLContext, ParentType extends ResolversParentTypes['Vertex'] = ResolversParentTypes['Vertex']> = {
  __resolveType: TypeResolveFn<'User' | 'Subject', ParentType, ContextType>;
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type EdgeResolvers<ContextType = MoodleNetGraphQLContext, ParentType extends ResolversParentTypes['Edge'] = ResolversParentTypes['Edge']> = {
  __resolveType: TypeResolveFn<'UserFollowsSubject' | 'UserFollowsUser', ParentType, ContextType>;
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _from: Resolver<Maybe<ResolversTypes['Vertex']>, ParentType, ContextType>;
  _to: Resolver<Maybe<ResolversTypes['Vertex']>, ParentType, ContextType>;
};

export type UserFollowsSubjectResolvers<ContextType = MoodleNetGraphQLContext, ParentType extends ResolversParentTypes['UserFollowsSubject'] = ResolversParentTypes['UserFollowsSubject']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _from: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  _to: Resolver<Maybe<ResolversTypes['Subject']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = MoodleNetGraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  followers: Resolver<Array<ResolversTypes['UserFollowsUser']>, ParentType, ContextType, RequireFields<UserFollowersArgs, never>>;
  followsSubjects: Resolver<Array<ResolversTypes['UserFollowsSubject']>, ParentType, ContextType, RequireFields<UserFollowsSubjectsArgs, never>>;
  followsUsers: Resolver<Array<ResolversTypes['UserFollowsUser']>, ParentType, ContextType, RequireFields<UserFollowsUsersArgs, never>>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubjectResolvers<ContextType = MoodleNetGraphQLContext, ParentType extends ResolversParentTypes['Subject'] = ResolversParentTypes['Subject']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  followers: Resolver<Array<ResolversTypes['UserFollowsSubject']>, ParentType, ContextType, RequireFields<SubjectFollowersArgs, never>>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = MoodleNetGraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createSubject: Resolver<Maybe<ResolversTypes['Subject']>, ParentType, ContextType, RequireFields<MutationCreateSubjectArgs, 'subjectInput'>>;
  createUser: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'user'>>;
  followSubject: Resolver<Maybe<ResolversTypes['UserFollowsSubject']>, ParentType, ContextType, RequireFields<MutationFollowSubjectArgs, never>>;
  followUser: Resolver<Maybe<ResolversTypes['UserFollowsUser']>, ParentType, ContextType, RequireFields<MutationFollowUserArgs, never>>;
};

export type UserFollowsUserResolvers<ContextType = MoodleNetGraphQLContext, ParentType extends ResolversParentTypes['UserFollowsUser'] = ResolversParentTypes['UserFollowsUser']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _from: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  _to: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = MoodleNetGraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  subject: Resolver<Maybe<ResolversTypes['Subject']>, ParentType, ContextType, RequireFields<QuerySubjectArgs, '_id'>>;
  user: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, '_id'>>;
};

export type Resolvers<ContextType = MoodleNetGraphQLContext> = {
  Vertex: VertexResolvers<ContextType>;
  Edge: EdgeResolvers<ContextType>;
  UserFollowsSubject: UserFollowsSubjectResolvers<ContextType>;
  User: UserResolvers<ContextType>;
  Subject: SubjectResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  UserFollowsUser: UserFollowsUserResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = MoodleNetGraphQLContext> = Resolvers<ContextType>;
