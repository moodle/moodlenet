import * as Types from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { MoodleNetExecutionContext, RootValue } from './types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };


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
) => Types.Maybe<TTypes> | Promise<Types.Maybe<TTypes>>;

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
  AppliesTo: ResolverTypeWrapper<Types.AppliesTo>;
  ID: ResolverTypeWrapper<Types.Scalars['ID']>;
  AssetRef: ResolverTypeWrapper<Types.Scalars['AssetRef']>;
  AssetRefInput: Types.AssetRefInput;
  String: ResolverTypeWrapper<Types.Scalars['String']>;
  AssetRefInputType: Types.AssetRefInputType;
  Collection: ResolverTypeWrapper<Types.Collection>;
  Int: ResolverTypeWrapper<Types.Scalars['Int']>;
  Boolean: ResolverTypeWrapper<Types.Scalars['Boolean']>;
  ConnAssertion: Types.ConnAssertion;
  Contains: ResolverTypeWrapper<Types.Contains>;
  ContentNodeInput: Types.ContentNodeInput;
  CreateCollectionInput: Types.CreateCollectionInput;
  CreateEdgeInput: Types.CreateEdgeInput;
  CreateEdgeMutationError: ResolverTypeWrapper<Types.CreateEdgeMutationError>;
  CreateEdgeMutationErrorType: Types.CreateEdgeMutationErrorType;
  CreateEdgeMutationPayload: ResolversTypes['CreateEdgeMutationSuccess'] | ResolversTypes['CreateEdgeMutationError'];
  CreateEdgeMutationSuccess: ResolverTypeWrapper<Omit<Types.CreateEdgeMutationSuccess, 'edge'> & { edge: ResolversTypes['Edge'] }>;
  CreateNodeInput: Types.CreateNodeInput;
  CreateNodeMutationError: ResolverTypeWrapper<Types.CreateNodeMutationError>;
  CreateNodeMutationErrorType: Types.CreateNodeMutationErrorType;
  CreateNodeMutationPayload: ResolversTypes['CreateNodeMutationSuccess'] | ResolversTypes['CreateNodeMutationError'];
  CreateNodeMutationSuccess: ResolverTypeWrapper<Omit<Types.CreateNodeMutationSuccess, 'node'> & { node: ResolversTypes['Node'] }>;
  CreateProfileInput: Types.CreateProfileInput;
  CreateResourceInput: Types.CreateResourceInput;
  CreateSession: ResolverTypeWrapper<Types.CreateSession>;
  CreateSubjectInput: Types.CreateSubjectInput;
  Created: ResolverTypeWrapper<Types.Created>;
  CtxAssertion: Types.CtxAssertion;
  Cursor: ResolverTypeWrapper<Types.Scalars['Cursor']>;
  DateTime: ResolverTypeWrapper<Types.Scalars['DateTime']>;
  DeleteEdgeInput: Types.DeleteEdgeInput;
  DeleteEdgeMutationError: ResolverTypeWrapper<Types.DeleteEdgeMutationError>;
  DeleteEdgeMutationErrorType: Types.DeleteEdgeMutationErrorType;
  DeleteEdgeMutationPayload: ResolversTypes['DeleteEdgeMutationSuccess'] | ResolversTypes['DeleteEdgeMutationError'];
  DeleteEdgeMutationSuccess: ResolverTypeWrapper<Types.DeleteEdgeMutationSuccess>;
  DeleteNodeInput: Types.DeleteNodeInput;
  DeleteNodeMutationError: ResolverTypeWrapper<Types.DeleteNodeMutationError>;
  DeleteNodeMutationErrorType: Types.DeleteNodeMutationErrorType;
  DeleteNodeMutationPayload: ResolversTypes['DeleteNodeMutationSuccess'] | ResolversTypes['DeleteNodeMutationError'];
  DeleteNodeMutationSuccess: ResolverTypeWrapper<Types.DeleteNodeMutationSuccess>;
  Edge: ResolversTypes['AppliesTo'] | ResolversTypes['Contains'] | ResolversTypes['Created'] | ResolversTypes['Follows'] | ResolversTypes['Likes'];
  EdgeType: Types.EdgeType;
  EdgeTypeInput: Types.EdgeTypeInput;
  Empty: ResolverTypeWrapper<Types.Scalars['Empty']>;
  Follows: ResolverTypeWrapper<Types.Follows>;
  GlobalSearchSort: Types.GlobalSearchSort;
  GlyphByAt: ResolverTypeWrapper<Types.GlyphByAt>;
  IContentNode: ResolversTypes['Collection'] | ResolversTypes['Profile'] | ResolversTypes['Resource'] | ResolversTypes['Subject'];
  IEdge: ResolversTypes['AppliesTo'] | ResolversTypes['Contains'] | ResolversTypes['Created'] | ResolversTypes['Follows'] | ResolversTypes['Likes'];
  INode: ResolversTypes['Collection'] | ResolversTypes['Profile'] | ResolversTypes['Resource'] | ResolversTypes['Subject'];
  Likes: ResolverTypeWrapper<Types.Likes>;
  Mutation: ResolverTypeWrapper<RootValue>;
  Never: ResolverTypeWrapper<Types.Scalars['Never']>;
  Node: ResolversTypes['Collection'] | ResolversTypes['Profile'] | ResolversTypes['Resource'] | ResolversTypes['Subject'];
  NodeAssertion: Types.NodeAssertion;
  NodeType: Types.NodeType;
  Page: ResolversTypes['RelPage'] | ResolversTypes['SearchPage'];
  PageEdge: ResolversTypes['RelPageEdge'] | ResolversTypes['SearchPageEdge'];
  PageInfo: ResolverTypeWrapper<Types.PageInfo>;
  PaginationInput: Types.PaginationInput;
  Profile: ResolverTypeWrapper<Types.Profile>;
  Query: ResolverTypeWrapper<RootValue>;
  RelPage: ResolverTypeWrapper<Types.RelPage>;
  RelPageEdge: ResolverTypeWrapper<Types.RelPageEdge>;
  Resource: ResolverTypeWrapper<Types.Resource>;
  Role: Types.Role;
  SearchPage: ResolverTypeWrapper<Types.SearchPage>;
  SearchPageEdge: ResolverTypeWrapper<Types.SearchPageEdge>;
  SimpleResponse: ResolverTypeWrapper<Types.SimpleResponse>;
  Subject: ResolverTypeWrapper<Types.Subject>;
  UpdateCollectionInput: Types.UpdateCollectionInput;
  UpdateEdgeInput: Types.UpdateEdgeInput;
  UpdateEdgeMutationError: ResolverTypeWrapper<Types.UpdateEdgeMutationError>;
  UpdateEdgeMutationErrorType: Types.UpdateEdgeMutationErrorType;
  UpdateEdgeMutationPayload: ResolversTypes['UpdateEdgeMutationSuccess'] | ResolversTypes['UpdateEdgeMutationError'];
  UpdateEdgeMutationSuccess: ResolverTypeWrapper<Omit<Types.UpdateEdgeMutationSuccess, 'edge'> & { edge?: Types.Maybe<ResolversTypes['Edge']> }>;
  UpdateNodeInput: Types.UpdateNodeInput;
  UpdateNodeMutationError: ResolverTypeWrapper<Types.UpdateNodeMutationError>;
  UpdateNodeMutationErrorType: Types.UpdateNodeMutationErrorType;
  UpdateNodeMutationPayload: ResolversTypes['UpdateNodeMutationSuccess'] | ResolversTypes['UpdateNodeMutationError'];
  UpdateNodeMutationSuccess: ResolverTypeWrapper<Omit<Types.UpdateNodeMutationSuccess, 'node'> & { node?: Types.Maybe<ResolversTypes['Node']> }>;
  UpdateProfileInput: Types.UpdateProfileInput;
  UpdateResourceInput: Types.UpdateResourceInput;
  UpdateSubjectInput: Types.UpdateSubjectInput;
  UserSession: ResolverTypeWrapper<Types.UserSession>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AppliesTo: Types.AppliesTo;
  ID: Types.Scalars['ID'];
  AssetRef: Types.Scalars['AssetRef'];
  AssetRefInput: Types.AssetRefInput;
  String: Types.Scalars['String'];
  Collection: Types.Collection;
  Int: Types.Scalars['Int'];
  Boolean: Types.Scalars['Boolean'];
  Contains: Types.Contains;
  ContentNodeInput: Types.ContentNodeInput;
  CreateCollectionInput: Types.CreateCollectionInput;
  CreateEdgeInput: Types.CreateEdgeInput;
  CreateEdgeMutationError: Types.CreateEdgeMutationError;
  CreateEdgeMutationPayload: ResolversParentTypes['CreateEdgeMutationSuccess'] | ResolversParentTypes['CreateEdgeMutationError'];
  CreateEdgeMutationSuccess: Omit<Types.CreateEdgeMutationSuccess, 'edge'> & { edge: ResolversParentTypes['Edge'] };
  CreateNodeInput: Types.CreateNodeInput;
  CreateNodeMutationError: Types.CreateNodeMutationError;
  CreateNodeMutationPayload: ResolversParentTypes['CreateNodeMutationSuccess'] | ResolversParentTypes['CreateNodeMutationError'];
  CreateNodeMutationSuccess: Omit<Types.CreateNodeMutationSuccess, 'node'> & { node: ResolversParentTypes['Node'] };
  CreateProfileInput: Types.CreateProfileInput;
  CreateResourceInput: Types.CreateResourceInput;
  CreateSession: Types.CreateSession;
  CreateSubjectInput: Types.CreateSubjectInput;
  Created: Types.Created;
  Cursor: Types.Scalars['Cursor'];
  DateTime: Types.Scalars['DateTime'];
  DeleteEdgeInput: Types.DeleteEdgeInput;
  DeleteEdgeMutationError: Types.DeleteEdgeMutationError;
  DeleteEdgeMutationPayload: ResolversParentTypes['DeleteEdgeMutationSuccess'] | ResolversParentTypes['DeleteEdgeMutationError'];
  DeleteEdgeMutationSuccess: Types.DeleteEdgeMutationSuccess;
  DeleteNodeInput: Types.DeleteNodeInput;
  DeleteNodeMutationError: Types.DeleteNodeMutationError;
  DeleteNodeMutationPayload: ResolversParentTypes['DeleteNodeMutationSuccess'] | ResolversParentTypes['DeleteNodeMutationError'];
  DeleteNodeMutationSuccess: Types.DeleteNodeMutationSuccess;
  Edge: ResolversParentTypes['AppliesTo'] | ResolversParentTypes['Contains'] | ResolversParentTypes['Created'] | ResolversParentTypes['Follows'] | ResolversParentTypes['Likes'];
  EdgeTypeInput: Types.EdgeTypeInput;
  Empty: Types.Scalars['Empty'];
  Follows: Types.Follows;
  GlyphByAt: Types.GlyphByAt;
  IContentNode: ResolversParentTypes['Collection'] | ResolversParentTypes['Profile'] | ResolversParentTypes['Resource'] | ResolversParentTypes['Subject'];
  IEdge: ResolversParentTypes['AppliesTo'] | ResolversParentTypes['Contains'] | ResolversParentTypes['Created'] | ResolversParentTypes['Follows'] | ResolversParentTypes['Likes'];
  INode: ResolversParentTypes['Collection'] | ResolversParentTypes['Profile'] | ResolversParentTypes['Resource'] | ResolversParentTypes['Subject'];
  Likes: Types.Likes;
  Mutation: RootValue;
  Never: Types.Scalars['Never'];
  Node: ResolversParentTypes['Collection'] | ResolversParentTypes['Profile'] | ResolversParentTypes['Resource'] | ResolversParentTypes['Subject'];
  Page: ResolversParentTypes['RelPage'] | ResolversParentTypes['SearchPage'];
  PageEdge: ResolversParentTypes['RelPageEdge'] | ResolversParentTypes['SearchPageEdge'];
  PageInfo: Types.PageInfo;
  PaginationInput: Types.PaginationInput;
  Profile: Types.Profile;
  Query: RootValue;
  RelPage: Types.RelPage;
  RelPageEdge: Types.RelPageEdge;
  Resource: Types.Resource;
  SearchPage: Types.SearchPage;
  SearchPageEdge: Types.SearchPageEdge;
  SimpleResponse: Types.SimpleResponse;
  Subject: Types.Subject;
  UpdateCollectionInput: Types.UpdateCollectionInput;
  UpdateEdgeInput: Types.UpdateEdgeInput;
  UpdateEdgeMutationError: Types.UpdateEdgeMutationError;
  UpdateEdgeMutationPayload: ResolversParentTypes['UpdateEdgeMutationSuccess'] | ResolversParentTypes['UpdateEdgeMutationError'];
  UpdateEdgeMutationSuccess: Omit<Types.UpdateEdgeMutationSuccess, 'edge'> & { edge?: Types.Maybe<ResolversParentTypes['Edge']> };
  UpdateNodeInput: Types.UpdateNodeInput;
  UpdateNodeMutationError: Types.UpdateNodeMutationError;
  UpdateNodeMutationPayload: ResolversParentTypes['UpdateNodeMutationSuccess'] | ResolversParentTypes['UpdateNodeMutationError'];
  UpdateNodeMutationSuccess: Omit<Types.UpdateNodeMutationSuccess, 'node'> & { node?: Types.Maybe<ResolversParentTypes['Node']> };
  UpdateProfileInput: Types.UpdateProfileInput;
  UpdateResourceInput: Types.UpdateResourceInput;
  UpdateSubjectInput: Types.UpdateSubjectInput;
  UserSession: Types.UserSession;
};

export type AppliesToResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['AppliesTo'] = ResolversParentTypes['AppliesTo']> = {
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>;
  _lastEdited?: Resolver<Types.Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface AssetRefScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AssetRef'], any> {
  name: 'AssetRef';
}

export type CollectionResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Collection'] = ResolversParentTypes['Collection']> = {
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>;
  _lastEdited?: Resolver<Types.Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Types.Collection_RelArgs, 'edge'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Types.Collection_RelCountArgs, 'type' | 'target'>>;
  icon?: Resolver<Types.Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContainsResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Contains'] = ResolversParentTypes['Contains']> = {
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>;
  _lastEdited?: Resolver<Types.Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateEdgeMutationErrorResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['CreateEdgeMutationError'] = ResolversParentTypes['CreateEdgeMutationError']> = {
  type?: Resolver<ResolversTypes['CreateEdgeMutationErrorType'], ParentType, ContextType>;
  details?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  details?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateNodeMutationPayloadResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['CreateNodeMutationPayload'] = ResolversParentTypes['CreateNodeMutationPayload']> = {
  __resolveType: TypeResolveFn<'CreateNodeMutationSuccess' | 'CreateNodeMutationError', ParentType, ContextType>;
};

export type CreateNodeMutationSuccessResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['CreateNodeMutationSuccess'] = ResolversParentTypes['CreateNodeMutationSuccess']> = {
  node?: Resolver<ResolversTypes['Node'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateSessionResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['CreateSession'] = ResolversParentTypes['CreateSession']> = {
  jwt?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreatedResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Created'] = ResolversParentTypes['Created']> = {
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>;
  _lastEdited?: Resolver<Types.Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>;
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
  type?: Resolver<Types.Maybe<ResolversTypes['DeleteEdgeMutationErrorType']>, ParentType, ContextType>;
  details?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteEdgeMutationPayloadResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['DeleteEdgeMutationPayload'] = ResolversParentTypes['DeleteEdgeMutationPayload']> = {
  __resolveType: TypeResolveFn<'DeleteEdgeMutationSuccess' | 'DeleteEdgeMutationError', ParentType, ContextType>;
};

export type DeleteEdgeMutationSuccessResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['DeleteEdgeMutationSuccess'] = ResolversParentTypes['DeleteEdgeMutationSuccess']> = {
  edgeId?: Resolver<Types.Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteNodeMutationErrorResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['DeleteNodeMutationError'] = ResolversParentTypes['DeleteNodeMutationError']> = {
  type?: Resolver<Types.Maybe<ResolversTypes['DeleteNodeMutationErrorType']>, ParentType, ContextType>;
  details?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteNodeMutationPayloadResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['DeleteNodeMutationPayload'] = ResolversParentTypes['DeleteNodeMutationPayload']> = {
  __resolveType: TypeResolveFn<'DeleteNodeMutationSuccess' | 'DeleteNodeMutationError', ParentType, ContextType>;
};

export type DeleteNodeMutationSuccessResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['DeleteNodeMutationSuccess'] = ResolversParentTypes['DeleteNodeMutationSuccess']> = {
  nodeId?: Resolver<Types.Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
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
  _lastEdited?: Resolver<Types.Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>;
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
  icon?: Resolver<Types.Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>;
};

export type IEdgeResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['IEdge'] = ResolversParentTypes['IEdge']> = {
  __resolveType: TypeResolveFn<'AppliesTo' | 'Contains' | 'Created' | 'Follows' | 'Likes', ParentType, ContextType>;
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>;
  _lastEdited?: Resolver<Types.Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>;
  id?: Resolver<Types.Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
};

export type INodeResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['INode'] = ResolversParentTypes['INode']> = {
  __resolveType: TypeResolveFn<'Collection' | 'Profile' | 'Resource' | 'Subject', ParentType, ContextType>;
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>;
  _lastEdited?: Resolver<Types.Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Types.INode_RelArgs, 'edge'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Types.INode_RelCountArgs, 'type' | 'target'>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type LikesResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Likes'] = ResolversParentTypes['Likes']> = {
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>;
  _lastEdited?: Resolver<Types.Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  signUp?: Resolver<ResolversTypes['SimpleResponse'], ParentType, ContextType, RequireFields<Types.MutationSignUpArgs, 'email'>>;
  changePassword?: Resolver<ResolversTypes['SimpleResponse'], ParentType, ContextType, RequireFields<Types.MutationChangePasswordArgs, 'newPassword' | 'currentPassword'>>;
  activateUser?: Resolver<ResolversTypes['CreateSession'], ParentType, ContextType, RequireFields<Types.MutationActivateUserArgs, 'username' | 'password' | 'token'>>;
  createSession?: Resolver<ResolversTypes['CreateSession'], ParentType, ContextType, RequireFields<Types.MutationCreateSessionArgs, 'username' | 'password'>>;
  changeEmailRequest?: Resolver<ResolversTypes['SimpleResponse'], ParentType, ContextType, RequireFields<Types.MutationChangeEmailRequestArgs, 'newEmail'>>;
  changeEmailConfirm?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<Types.MutationChangeEmailConfirmArgs, 'token' | 'password' | 'username'>>;
  sessionByEmail?: Resolver<ResolversTypes['SimpleResponse'], ParentType, ContextType, RequireFields<Types.MutationSessionByEmailArgs, 'username' | 'email'>>;
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
  endCursor?: Resolver<Types.Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Types.Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProfileResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Profile'] = ResolversParentTypes['Profile']> = {
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>;
  _lastEdited?: Resolver<Types.Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Types.Profile_RelArgs, 'edge'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Types.Profile_RelCountArgs, 'type' | 'target'>>;
  icon?: Resolver<Types.Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getSession?: Resolver<Types.Maybe<ResolversTypes['UserSession']>, ParentType, ContextType>;
  globalSearch?: Resolver<ResolversTypes['SearchPage'], ParentType, ContextType, RequireFields<Types.QueryGlobalSearchArgs, 'text' | 'sortBy'>>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.QueryNodeArgs, 'id'>>;
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
  _lastEdited?: Resolver<Types.Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Types.Resource_RelArgs, 'edge'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Types.Resource_RelCountArgs, 'type' | 'target'>>;
  icon?: Resolver<Types.Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>;
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

export type SimpleResponseResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['SimpleResponse'] = ResolversParentTypes['SimpleResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubjectResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Subject'] = ResolversParentTypes['Subject']> = {
  _created?: Resolver<ResolversTypes['GlyphByAt'], ParentType, ContextType>;
  _lastEdited?: Resolver<Types.Maybe<ResolversTypes['GlyphByAt']>, ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Types.Subject_RelArgs, 'edge'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Types.Subject_RelCountArgs, 'type' | 'target'>>;
  icon?: Resolver<Types.Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateEdgeMutationErrorResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['UpdateEdgeMutationError'] = ResolversParentTypes['UpdateEdgeMutationError']> = {
  type?: Resolver<ResolversTypes['UpdateEdgeMutationErrorType'], ParentType, ContextType>;
  details?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateEdgeMutationPayloadResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['UpdateEdgeMutationPayload'] = ResolversParentTypes['UpdateEdgeMutationPayload']> = {
  __resolveType: TypeResolveFn<'UpdateEdgeMutationSuccess' | 'UpdateEdgeMutationError', ParentType, ContextType>;
};

export type UpdateEdgeMutationSuccessResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['UpdateEdgeMutationSuccess'] = ResolversParentTypes['UpdateEdgeMutationSuccess']> = {
  edge?: Resolver<Types.Maybe<ResolversTypes['Edge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateNodeMutationErrorResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['UpdateNodeMutationError'] = ResolversParentTypes['UpdateNodeMutationError']> = {
  type?: Resolver<ResolversTypes['UpdateNodeMutationErrorType'], ParentType, ContextType>;
  details?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateNodeMutationPayloadResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['UpdateNodeMutationPayload'] = ResolversParentTypes['UpdateNodeMutationPayload']> = {
  __resolveType: TypeResolveFn<'UpdateNodeMutationSuccess' | 'UpdateNodeMutationError', ParentType, ContextType>;
};

export type UpdateNodeMutationSuccessResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['UpdateNodeMutationSuccess'] = ResolversParentTypes['UpdateNodeMutationSuccess']> = {
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSessionResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['UserSession'] = ResolversParentTypes['UserSession']> = {
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  changeEmailRequest?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  profileId?: Resolver<Types.Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
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
  CreateSession?: CreateSessionResolvers<ContextType>;
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
  Mutation?: MutationResolvers<ContextType>;
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
  SimpleResponse?: SimpleResponseResolvers<ContextType>;
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
