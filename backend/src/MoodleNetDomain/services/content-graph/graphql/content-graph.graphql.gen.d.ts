import { GraphQLResolveInfo } from 'graphql';
import { Context, RootValue } from '../../../GQL';
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

export enum ContentCursorDir {
  After = 'after',
  Before = 'before',
  Middle = 'middle'
}

export type ContentInputCursor = {
  _id: Scalars['ID'];
  dir: ContentCursorDir;
};

export type ContentPageInput = {
  limit: Maybe<Scalars['Int']>;
  cursor: Maybe<ContentInputCursor>;
};

export type ContentUserFollowsSubject = Edge & {
  __typename: 'ContentUserFollowsSubject';
  _id: Scalars['ID'];
  _from: Maybe<ContentUser>;
  _to: Maybe<ContentSubject>;
};

export type ContentUser = Vertex & {
  __typename: 'ContentUser';
  _id: Scalars['ID'];
  followers: Array<ContentUserFollowsUser>;
  followsSubjects: Array<ContentUserFollowsSubject>;
  followsUsers: Array<ContentUserFollowsUser>;
  name: Scalars['String'];
};


export type ContentUserFollowersArgs = {
  page: Maybe<ContentPageInput>;
};


export type ContentUserFollowsSubjectsArgs = {
  page: Maybe<ContentPageInput>;
};


export type ContentUserFollowsUsersArgs = {
  page: Maybe<ContentPageInput>;
};

export type ContentSubject = Vertex & {
  __typename: 'ContentSubject';
  _id: Scalars['ID'];
  followers: Array<ContentUserFollowsSubject>;
  name: Scalars['String'];
};


export type ContentSubjectFollowersArgs = {
  page: Maybe<ContentPageInput>;
};

export type Mutation = {
  __typename: 'Mutation';
  contentCreateSubject: Maybe<ContentSubject>;
  contentFollowSubject: Maybe<ContentUserFollowsSubject>;
  contentFollowUser: Maybe<ContentUserFollowsUser>;
  createContentUser: ContentUser;
};


export type MutationContentCreateSubjectArgs = {
  subjectInput: ContentCreateSubjectInput;
};


export type MutationContentFollowSubjectArgs = {
  subjectId: Maybe<Scalars['ID']>;
};


export type MutationContentFollowUserArgs = {
  userId: Maybe<Scalars['ID']>;
};


export type MutationCreateContentUserArgs = {
  user: ContentCreateUserInput;
};

export type ContentUserFollowsUser = Edge & {
  __typename: 'ContentUserFollowsUser';
  _id: Scalars['ID'];
  _from: Maybe<ContentUser>;
  _to: Maybe<ContentUser>;
};

export type ContentCreateSubjectInput = {
  name: Scalars['String'];
};

export type Query = {
  __typename: 'Query';
  contentSubject: Maybe<ContentSubject>;
  contentUser: Maybe<ContentUser>;
};


export type QueryContentSubjectArgs = {
  _id: Scalars['ID'];
};


export type QueryContentUserArgs = {
  _id: Scalars['ID'];
};

export type ContentCreateUserInput = {
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
  Vertex: ResolversTypes['ContentUser'] | ResolversTypes['ContentSubject'];
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Edge: ResolversTypes['ContentUserFollowsSubject'] | ResolversTypes['ContentUserFollowsUser'];
  ContentCursorDir: ContentCursorDir;
  ContentInputCursor: ContentInputCursor;
  ContentPageInput: ContentPageInput;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  ContentUserFollowsSubject: ResolverTypeWrapper<ContentUserFollowsSubject>;
  ContentUser: ResolverTypeWrapper<ContentUser>;
  String: ResolverTypeWrapper<Scalars['String']>;
  ContentSubject: ResolverTypeWrapper<ContentSubject>;
  Mutation: ResolverTypeWrapper<RootValue>;
  ContentUserFollowsUser: ResolverTypeWrapper<ContentUserFollowsUser>;
  ContentCreateSubjectInput: ContentCreateSubjectInput;
  Query: ResolverTypeWrapper<RootValue>;
  ContentCreateUserInput: ContentCreateUserInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Vertex: ResolversParentTypes['ContentUser'] | ResolversParentTypes['ContentSubject'];
  ID: Scalars['ID'];
  Edge: ResolversParentTypes['ContentUserFollowsSubject'] | ResolversParentTypes['ContentUserFollowsUser'];
  ContentInputCursor: ContentInputCursor;
  ContentPageInput: ContentPageInput;
  Int: Scalars['Int'];
  ContentUserFollowsSubject: ContentUserFollowsSubject;
  ContentUser: ContentUser;
  String: Scalars['String'];
  ContentSubject: ContentSubject;
  Mutation: RootValue;
  ContentUserFollowsUser: ContentUserFollowsUser;
  ContentCreateSubjectInput: ContentCreateSubjectInput;
  Query: RootValue;
  ContentCreateUserInput: ContentCreateUserInput;
  Boolean: Scalars['Boolean'];
};

export type VertexResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Vertex'] = ResolversParentTypes['Vertex']> = {
  __resolveType: TypeResolveFn<'ContentUser' | 'ContentSubject', ParentType, ContextType>;
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type EdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Edge'] = ResolversParentTypes['Edge']> = {
  __resolveType: TypeResolveFn<'ContentUserFollowsSubject' | 'ContentUserFollowsUser', ParentType, ContextType>;
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _from: Resolver<Maybe<ResolversTypes['Vertex']>, ParentType, ContextType>;
  _to: Resolver<Maybe<ResolversTypes['Vertex']>, ParentType, ContextType>;
};

export type ContentUserFollowsSubjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ContentUserFollowsSubject'] = ResolversParentTypes['ContentUserFollowsSubject']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _from: Resolver<Maybe<ResolversTypes['ContentUser']>, ParentType, ContextType>;
  _to: Resolver<Maybe<ResolversTypes['ContentSubject']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContentUserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ContentUser'] = ResolversParentTypes['ContentUser']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  followers: Resolver<Array<ResolversTypes['ContentUserFollowsUser']>, ParentType, ContextType, RequireFields<ContentUserFollowersArgs, never>>;
  followsSubjects: Resolver<Array<ResolversTypes['ContentUserFollowsSubject']>, ParentType, ContextType, RequireFields<ContentUserFollowsSubjectsArgs, never>>;
  followsUsers: Resolver<Array<ResolversTypes['ContentUserFollowsUser']>, ParentType, ContextType, RequireFields<ContentUserFollowsUsersArgs, never>>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContentSubjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ContentSubject'] = ResolversParentTypes['ContentSubject']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  followers: Resolver<Array<ResolversTypes['ContentUserFollowsSubject']>, ParentType, ContextType, RequireFields<ContentSubjectFollowersArgs, never>>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  contentCreateSubject: Resolver<Maybe<ResolversTypes['ContentSubject']>, ParentType, ContextType, RequireFields<MutationContentCreateSubjectArgs, 'subjectInput'>>;
  contentFollowSubject: Resolver<Maybe<ResolversTypes['ContentUserFollowsSubject']>, ParentType, ContextType, RequireFields<MutationContentFollowSubjectArgs, never>>;
  contentFollowUser: Resolver<Maybe<ResolversTypes['ContentUserFollowsUser']>, ParentType, ContextType, RequireFields<MutationContentFollowUserArgs, never>>;
  createContentUser: Resolver<ResolversTypes['ContentUser'], ParentType, ContextType, RequireFields<MutationCreateContentUserArgs, 'user'>>;
};

export type ContentUserFollowsUserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ContentUserFollowsUser'] = ResolversParentTypes['ContentUserFollowsUser']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _from: Resolver<Maybe<ResolversTypes['ContentUser']>, ParentType, ContextType>;
  _to: Resolver<Maybe<ResolversTypes['ContentUser']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  contentSubject: Resolver<Maybe<ResolversTypes['ContentSubject']>, ParentType, ContextType, RequireFields<QueryContentSubjectArgs, '_id'>>;
  contentUser: Resolver<Maybe<ResolversTypes['ContentUser']>, ParentType, ContextType, RequireFields<QueryContentUserArgs, '_id'>>;
};

export type Resolvers<ContextType = Context> = {
  Vertex: VertexResolvers<ContextType>;
  Edge: EdgeResolvers<ContextType>;
  ContentUserFollowsSubject: ContentUserFollowsSubjectResolvers<ContextType>;
  ContentUser: ContentUserResolvers<ContextType>;
  ContentSubject: ContentSubjectResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  ContentUserFollowsUser: ContentUserFollowsUserResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
