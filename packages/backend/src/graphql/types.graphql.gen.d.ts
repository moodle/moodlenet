import * as Types from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Context, RootValue } from './types';
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
  AssetRef: ResolverTypeWrapper<Types.Scalars['AssetRef']>;
  AssetRefInput: Types.AssetRefInput;
  String: ResolverTypeWrapper<Types.Scalars['String']>;
  AssetRefInputType: Types.AssetRefInputType;
  Collection: ResolverTypeWrapper<Types.Collection>;
  ID: ResolverTypeWrapper<Types.Scalars['ID']>;
  Boolean: ResolverTypeWrapper<Types.Scalars['Boolean']>;
  Int: ResolverTypeWrapper<Types.Scalars['Int']>;
  Contains: ResolverTypeWrapper<Types.Contains>;
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
  CreateResourceInput: Types.CreateResourceInput;
  CreateSession: ResolverTypeWrapper<Types.CreateSession>;
  Created: ResolverTypeWrapper<Types.Created>;
  Cursor: ResolverTypeWrapper<Types.Scalars['Cursor']>;
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
  Edge: ResolversTypes['Contains'] | ResolversTypes['Created'] | ResolversTypes['Follows'] | ResolversTypes['HasUserRole'] | ResolversTypes['Pinned'];
  EdgeType: Types.EdgeType;
  EditCollectionInput: Types.EditCollectionInput;
  EditNodeInput: Types.EditNodeInput;
  EditNodeMutationError: ResolverTypeWrapper<Types.EditNodeMutationError>;
  EditNodeMutationErrorType: Types.EditNodeMutationErrorType;
  EditNodeMutationPayload: ResolversTypes['EditNodeMutationSuccess'] | ResolversTypes['EditNodeMutationError'];
  EditNodeMutationSuccess: ResolverTypeWrapper<Omit<Types.EditNodeMutationSuccess, 'node'> & { node?: Types.Maybe<ResolversTypes['Node']> }>;
  EditProfileInput: Types.EditProfileInput;
  EditResourceInput: Types.EditResourceInput;
  Empty: ResolverTypeWrapper<Types.Scalars['Empty']>;
  Follows: ResolverTypeWrapper<Types.Follows>;
  GlobalSearchSort: Types.GlobalSearchSort;
  HasUserRole: ResolverTypeWrapper<Types.HasUserRole>;
  IEdge: ResolversTypes['Contains'] | ResolversTypes['Created'] | ResolversTypes['Follows'] | ResolversTypes['HasUserRole'] | ResolversTypes['Pinned'];
  INode: ResolversTypes['Collection'] | ResolversTypes['Iscedf'] | ResolversTypes['Organization'] | ResolversTypes['Profile'] | ResolversTypes['Resource'] | ResolversTypes['UserRole'];
  Iscedf: ResolverTypeWrapper<Types.Iscedf>;
  Mutation: ResolverTypeWrapper<RootValue>;
  Never: ResolverTypeWrapper<Types.Scalars['Never']>;
  Node: ResolversTypes['Collection'] | ResolversTypes['Iscedf'] | ResolversTypes['Organization'] | ResolversTypes['Profile'] | ResolversTypes['Resource'] | ResolversTypes['UserRole'];
  NodeType: Types.NodeType;
  Organization: ResolverTypeWrapper<Types.Organization>;
  Page: ResolversTypes['RelPage'] | ResolversTypes['SearchPage'];
  PageEdge: ResolversTypes['RelPageEdge'] | ResolversTypes['SearchPageEdge'];
  PageInfo: ResolverTypeWrapper<Types.PageInfo>;
  PaginationInput: Types.PaginationInput;
  Pinned: ResolverTypeWrapper<Types.Pinned>;
  Profile: ResolverTypeWrapper<Types.Profile>;
  Query: ResolverTypeWrapper<RootValue>;
  RelPage: ResolverTypeWrapper<Types.RelPage>;
  RelPageEdge: ResolverTypeWrapper<Types.RelPageEdge>;
  Resource: ResolverTypeWrapper<Types.Resource>;
  ResourceKind: Types.ResourceKind;
  SearchPage: ResolverTypeWrapper<Types.SearchPage>;
  SearchPageEdge: ResolverTypeWrapper<Types.SearchPageEdge>;
  SimpleResponse: ResolverTypeWrapper<Types.SimpleResponse>;
  Timestamp: ResolverTypeWrapper<Types.Scalars['Timestamp']>;
  UpdateEdgeInput: Types.UpdateEdgeInput;
  UpdateEdgeMutationError: ResolverTypeWrapper<Types.UpdateEdgeMutationError>;
  UpdateEdgeMutationErrorType: Types.UpdateEdgeMutationErrorType;
  UpdateEdgeMutationPayload: ResolversTypes['UpdateEdgeMutationSuccess'] | ResolversTypes['UpdateEdgeMutationError'];
  UpdateEdgeMutationSuccess: ResolverTypeWrapper<Omit<Types.UpdateEdgeMutationSuccess, 'edge'> & { edge?: Types.Maybe<ResolversTypes['Edge']> }>;
  UserRole: ResolverTypeWrapper<Types.UserRole>;
  UserRoleType: Types.UserRoleType;
  UserSession: ResolverTypeWrapper<Types.UserSession>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AssetRef: Types.Scalars['AssetRef'];
  AssetRefInput: Types.AssetRefInput;
  String: Types.Scalars['String'];
  Collection: Types.Collection;
  ID: Types.Scalars['ID'];
  Boolean: Types.Scalars['Boolean'];
  Int: Types.Scalars['Int'];
  Contains: Types.Contains;
  CreateCollectionInput: Types.CreateCollectionInput;
  CreateEdgeInput: Types.CreateEdgeInput;
  CreateEdgeMutationError: Types.CreateEdgeMutationError;
  CreateEdgeMutationPayload: ResolversParentTypes['CreateEdgeMutationSuccess'] | ResolversParentTypes['CreateEdgeMutationError'];
  CreateEdgeMutationSuccess: Omit<Types.CreateEdgeMutationSuccess, 'edge'> & { edge: ResolversParentTypes['Edge'] };
  CreateNodeInput: Types.CreateNodeInput;
  CreateNodeMutationError: Types.CreateNodeMutationError;
  CreateNodeMutationPayload: ResolversParentTypes['CreateNodeMutationSuccess'] | ResolversParentTypes['CreateNodeMutationError'];
  CreateNodeMutationSuccess: Omit<Types.CreateNodeMutationSuccess, 'node'> & { node: ResolversParentTypes['Node'] };
  CreateResourceInput: Types.CreateResourceInput;
  CreateSession: Types.CreateSession;
  Created: Types.Created;
  Cursor: Types.Scalars['Cursor'];
  DeleteEdgeInput: Types.DeleteEdgeInput;
  DeleteEdgeMutationError: Types.DeleteEdgeMutationError;
  DeleteEdgeMutationPayload: ResolversParentTypes['DeleteEdgeMutationSuccess'] | ResolversParentTypes['DeleteEdgeMutationError'];
  DeleteEdgeMutationSuccess: Types.DeleteEdgeMutationSuccess;
  DeleteNodeInput: Types.DeleteNodeInput;
  DeleteNodeMutationError: Types.DeleteNodeMutationError;
  DeleteNodeMutationPayload: ResolversParentTypes['DeleteNodeMutationSuccess'] | ResolversParentTypes['DeleteNodeMutationError'];
  DeleteNodeMutationSuccess: Types.DeleteNodeMutationSuccess;
  Edge: ResolversParentTypes['Contains'] | ResolversParentTypes['Created'] | ResolversParentTypes['Follows'] | ResolversParentTypes['HasUserRole'] | ResolversParentTypes['Pinned'];
  EditCollectionInput: Types.EditCollectionInput;
  EditNodeInput: Types.EditNodeInput;
  EditNodeMutationError: Types.EditNodeMutationError;
  EditNodeMutationPayload: ResolversParentTypes['EditNodeMutationSuccess'] | ResolversParentTypes['EditNodeMutationError'];
  EditNodeMutationSuccess: Omit<Types.EditNodeMutationSuccess, 'node'> & { node?: Types.Maybe<ResolversParentTypes['Node']> };
  EditProfileInput: Types.EditProfileInput;
  EditResourceInput: Types.EditResourceInput;
  Empty: Types.Scalars['Empty'];
  Follows: Types.Follows;
  HasUserRole: Types.HasUserRole;
  IEdge: ResolversParentTypes['Contains'] | ResolversParentTypes['Created'] | ResolversParentTypes['Follows'] | ResolversParentTypes['HasUserRole'] | ResolversParentTypes['Pinned'];
  INode: ResolversParentTypes['Collection'] | ResolversParentTypes['Iscedf'] | ResolversParentTypes['Organization'] | ResolversParentTypes['Profile'] | ResolversParentTypes['Resource'] | ResolversParentTypes['UserRole'];
  Iscedf: Types.Iscedf;
  Mutation: RootValue;
  Never: Types.Scalars['Never'];
  Node: ResolversParentTypes['Collection'] | ResolversParentTypes['Iscedf'] | ResolversParentTypes['Organization'] | ResolversParentTypes['Profile'] | ResolversParentTypes['Resource'] | ResolversParentTypes['UserRole'];
  Organization: Types.Organization;
  Page: ResolversParentTypes['RelPage'] | ResolversParentTypes['SearchPage'];
  PageEdge: ResolversParentTypes['RelPageEdge'] | ResolversParentTypes['SearchPageEdge'];
  PageInfo: Types.PageInfo;
  PaginationInput: Types.PaginationInput;
  Pinned: Types.Pinned;
  Profile: Types.Profile;
  Query: RootValue;
  RelPage: Types.RelPage;
  RelPageEdge: Types.RelPageEdge;
  Resource: Types.Resource;
  SearchPage: Types.SearchPage;
  SearchPageEdge: Types.SearchPageEdge;
  SimpleResponse: Types.SimpleResponse;
  Timestamp: Types.Scalars['Timestamp'];
  UpdateEdgeInput: Types.UpdateEdgeInput;
  UpdateEdgeMutationError: Types.UpdateEdgeMutationError;
  UpdateEdgeMutationPayload: ResolversParentTypes['UpdateEdgeMutationSuccess'] | ResolversParentTypes['UpdateEdgeMutationError'];
  UpdateEdgeMutationSuccess: Omit<Types.UpdateEdgeMutationSuccess, 'edge'> & { edge?: Types.Maybe<ResolversParentTypes['Edge']> };
  UserRole: Types.UserRole;
  UserSession: Types.UserSession;
};

export interface AssetRefScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AssetRef'], any> {
  name: 'AssetRef';
}

export type CollectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Collection'] = ResolversParentTypes['Collection']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<Types.Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Types.Collection_RelArgs, 'type' | 'target'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Types.Collection_RelCountArgs, 'type' | 'target'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContainsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Contains'] = ResolversParentTypes['Contains']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _created?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateEdgeMutationErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateEdgeMutationError'] = ResolversParentTypes['CreateEdgeMutationError']> = {
  type?: Resolver<ResolversTypes['CreateEdgeMutationErrorType'], ParentType, ContextType>;
  details?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateEdgeMutationPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateEdgeMutationPayload'] = ResolversParentTypes['CreateEdgeMutationPayload']> = {
  __resolveType?: TypeResolveFn<'CreateEdgeMutationSuccess' | 'CreateEdgeMutationError', ParentType, ContextType>;
};

export type CreateEdgeMutationSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateEdgeMutationSuccess'] = ResolversParentTypes['CreateEdgeMutationSuccess']> = {
  edge?: Resolver<ResolversTypes['Edge'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateNodeMutationErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateNodeMutationError'] = ResolversParentTypes['CreateNodeMutationError']> = {
  type?: Resolver<ResolversTypes['CreateNodeMutationErrorType'], ParentType, ContextType>;
  details?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateNodeMutationPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateNodeMutationPayload'] = ResolversParentTypes['CreateNodeMutationPayload']> = {
  __resolveType?: TypeResolveFn<'CreateNodeMutationSuccess' | 'CreateNodeMutationError', ParentType, ContextType>;
};

export type CreateNodeMutationSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateNodeMutationSuccess'] = ResolversParentTypes['CreateNodeMutationSuccess']> = {
  node?: Resolver<ResolversTypes['Node'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateSessionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateSession'] = ResolversParentTypes['CreateSession']> = {
  jwt?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreatedResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Created'] = ResolversParentTypes['Created']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _created?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface CursorScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Cursor'], any> {
  name: 'Cursor';
}

export type DeleteEdgeMutationErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteEdgeMutationError'] = ResolversParentTypes['DeleteEdgeMutationError']> = {
  type?: Resolver<Types.Maybe<ResolversTypes['DeleteEdgeMutationErrorType']>, ParentType, ContextType>;
  details?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteEdgeMutationPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteEdgeMutationPayload'] = ResolversParentTypes['DeleteEdgeMutationPayload']> = {
  __resolveType?: TypeResolveFn<'DeleteEdgeMutationSuccess' | 'DeleteEdgeMutationError', ParentType, ContextType>;
};

export type DeleteEdgeMutationSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteEdgeMutationSuccess'] = ResolversParentTypes['DeleteEdgeMutationSuccess']> = {
  edgeId?: Resolver<Types.Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteNodeMutationErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteNodeMutationError'] = ResolversParentTypes['DeleteNodeMutationError']> = {
  type?: Resolver<Types.Maybe<ResolversTypes['DeleteNodeMutationErrorType']>, ParentType, ContextType>;
  details?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteNodeMutationPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteNodeMutationPayload'] = ResolversParentTypes['DeleteNodeMutationPayload']> = {
  __resolveType?: TypeResolveFn<'DeleteNodeMutationSuccess' | 'DeleteNodeMutationError', ParentType, ContextType>;
};

export type DeleteNodeMutationSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteNodeMutationSuccess'] = ResolversParentTypes['DeleteNodeMutationSuccess']> = {
  nodeId?: Resolver<Types.Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Edge'] = ResolversParentTypes['Edge']> = {
  __resolveType?: TypeResolveFn<'Contains' | 'Created' | 'Follows' | 'HasUserRole' | 'Pinned', ParentType, ContextType>;
};

export type EditNodeMutationErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EditNodeMutationError'] = ResolversParentTypes['EditNodeMutationError']> = {
  type?: Resolver<ResolversTypes['EditNodeMutationErrorType'], ParentType, ContextType>;
  details?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EditNodeMutationPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EditNodeMutationPayload'] = ResolversParentTypes['EditNodeMutationPayload']> = {
  __resolveType?: TypeResolveFn<'EditNodeMutationSuccess' | 'EditNodeMutationError', ParentType, ContextType>;
};

export type EditNodeMutationSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EditNodeMutationSuccess'] = ResolversParentTypes['EditNodeMutationSuccess']> = {
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface EmptyScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Empty'], any> {
  name: 'Empty';
}

export type FollowsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Follows'] = ResolversParentTypes['Follows']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _created?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HasUserRoleResolvers<ContextType = Context, ParentType extends ResolversParentTypes['HasUserRole'] = ResolversParentTypes['HasUserRole']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _created?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['IEdge'] = ResolversParentTypes['IEdge']> = {
  __resolveType?: TypeResolveFn<'Contains' | 'Created' | 'Follows' | 'HasUserRole' | 'Pinned', ParentType, ContextType>;
  id?: Resolver<Types.Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  _created?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
};

export type INodeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['INode'] = ResolversParentTypes['INode']> = {
  __resolveType?: TypeResolveFn<'Collection' | 'Iscedf' | 'Organization' | 'Profile' | 'Resource' | 'UserRole', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Types.INode_RelArgs, 'type' | 'target'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Types.INode_RelCountArgs, 'type' | 'target'>>;
};

export type IscedfResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Iscedf'] = ResolversParentTypes['Iscedf']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  codePath?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  iscedCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  thumbnail?: Resolver<Types.Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>;
  image?: Resolver<Types.Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Types.Iscedf_RelArgs, 'type' | 'target'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Types.Iscedf_RelCountArgs, 'type' | 'target'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  activateUser?: Resolver<ResolversTypes['CreateSession'], ParentType, ContextType, RequireFields<Types.MutationActivateUserArgs, 'name' | 'password' | 'activationToken'>>;
  createNode?: Resolver<ResolversTypes['CreateNodeMutationPayload'], ParentType, ContextType, RequireFields<Types.MutationCreateNodeArgs, 'input'>>;
  createSession?: Resolver<ResolversTypes['CreateSession'], ParentType, ContextType, RequireFields<Types.MutationCreateSessionArgs, 'email' | 'password'>>;
  signUp?: Resolver<ResolversTypes['SimpleResponse'], ParentType, ContextType, RequireFields<Types.MutationSignUpArgs, 'email'>>;
};

export interface NeverScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Never'], any> {
  name: 'Never';
}

export type NodeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType?: TypeResolveFn<'Collection' | 'Iscedf' | 'Organization' | 'Profile' | 'Resource' | 'UserRole', ParentType, ContextType>;
};

export type OrganizationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Organization'] = ResolversParentTypes['Organization']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intro?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  logo?: Resolver<Types.Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>;
  image?: Resolver<Types.Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>;
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  domain?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Types.Organization_RelArgs, 'type' | 'target'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Types.Organization_RelCountArgs, 'type' | 'target'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Page'] = ResolversParentTypes['Page']> = {
  __resolveType?: TypeResolveFn<'RelPage' | 'SearchPage', ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['PageEdge']>, ParentType, ContextType>;
};

export type PageEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageEdge'] = ResolversParentTypes['PageEdge']> = {
  __resolveType?: TypeResolveFn<'RelPageEdge' | 'SearchPageEdge', ParentType, ContextType>;
  cursor?: Resolver<ResolversTypes['Cursor'], ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Types.Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Types.Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PinnedResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Pinned'] = ResolversParentTypes['Pinned']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _created?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProfileResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Profile'] = ResolversParentTypes['Profile']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  avatar?: Resolver<Types.Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>;
  bio?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<Types.Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>;
  firstName?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastName?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  siteUrl?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Types.Profile_RelArgs, 'type' | 'target'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Types.Profile_RelCountArgs, 'type' | 'target'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getSession?: Resolver<Types.Maybe<ResolversTypes['UserSession']>, ParentType, ContextType>;
  globalSearch?: Resolver<ResolversTypes['SearchPage'], ParentType, ContextType, RequireFields<Types.QueryGlobalSearchArgs, 'text' | 'sortBy'>>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.QueryNodeArgs, 'id'>>;
};

export type RelPageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RelPage'] = ResolversParentTypes['RelPage']> = {
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['RelPageEdge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RelPageEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RelPageEdge'] = ResolversParentTypes['RelPageEdge']> = {
  cursor?: Resolver<ResolversTypes['Cursor'], ParentType, ContextType>;
  edge?: Resolver<ResolversTypes['IEdge'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['INode'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResourceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Resource'] = ResolversParentTypes['Resource']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<Types.Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>;
  thumbnail?: Resolver<Types.Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>;
  content?: Resolver<ResolversTypes['AssetRef'], ParentType, ContextType>;
  kind?: Resolver<ResolversTypes['ResourceKind'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Types.Resource_RelArgs, 'type' | 'target'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Types.Resource_RelCountArgs, 'type' | 'target'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SearchPageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SearchPage'] = ResolversParentTypes['SearchPage']> = {
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['SearchPageEdge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SearchPageEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SearchPageEdge'] = ResolversParentTypes['SearchPageEdge']> = {
  cursor?: Resolver<ResolversTypes['Cursor'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['INode'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SimpleResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SimpleResponse'] = ResolversParentTypes['SimpleResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface TimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Timestamp'], any> {
  name: 'Timestamp';
}

export type UpdateEdgeMutationErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UpdateEdgeMutationError'] = ResolversParentTypes['UpdateEdgeMutationError']> = {
  type?: Resolver<ResolversTypes['UpdateEdgeMutationErrorType'], ParentType, ContextType>;
  details?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateEdgeMutationPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UpdateEdgeMutationPayload'] = ResolversParentTypes['UpdateEdgeMutationPayload']> = {
  __resolveType?: TypeResolveFn<'UpdateEdgeMutationSuccess' | 'UpdateEdgeMutationError', ParentType, ContextType>;
};

export type UpdateEdgeMutationSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UpdateEdgeMutationSuccess'] = ResolversParentTypes['UpdateEdgeMutationSuccess']> = {
  edge?: Resolver<Types.Maybe<ResolversTypes['Edge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserRoleResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserRole'] = ResolversParentTypes['UserRole']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['UserRoleType'], ParentType, ContextType>;
  descripton?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Types.UserRole_RelArgs, 'type' | 'target'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Types.UserRole_RelCountArgs, 'type' | 'target'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSessionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserSession'] = ResolversParentTypes['UserSession']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  profile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
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
  DeleteEdgeMutationError?: DeleteEdgeMutationErrorResolvers<ContextType>;
  DeleteEdgeMutationPayload?: DeleteEdgeMutationPayloadResolvers<ContextType>;
  DeleteEdgeMutationSuccess?: DeleteEdgeMutationSuccessResolvers<ContextType>;
  DeleteNodeMutationError?: DeleteNodeMutationErrorResolvers<ContextType>;
  DeleteNodeMutationPayload?: DeleteNodeMutationPayloadResolvers<ContextType>;
  DeleteNodeMutationSuccess?: DeleteNodeMutationSuccessResolvers<ContextType>;
  Edge?: EdgeResolvers<ContextType>;
  EditNodeMutationError?: EditNodeMutationErrorResolvers<ContextType>;
  EditNodeMutationPayload?: EditNodeMutationPayloadResolvers<ContextType>;
  EditNodeMutationSuccess?: EditNodeMutationSuccessResolvers<ContextType>;
  Empty?: GraphQLScalarType;
  Follows?: FollowsResolvers<ContextType>;
  HasUserRole?: HasUserRoleResolvers<ContextType>;
  IEdge?: IEdgeResolvers<ContextType>;
  INode?: INodeResolvers<ContextType>;
  Iscedf?: IscedfResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Never?: GraphQLScalarType;
  Node?: NodeResolvers<ContextType>;
  Organization?: OrganizationResolvers<ContextType>;
  Page?: PageResolvers<ContextType>;
  PageEdge?: PageEdgeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Pinned?: PinnedResolvers<ContextType>;
  Profile?: ProfileResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RelPage?: RelPageResolvers<ContextType>;
  RelPageEdge?: RelPageEdgeResolvers<ContextType>;
  Resource?: ResourceResolvers<ContextType>;
  SearchPage?: SearchPageResolvers<ContextType>;
  SearchPageEdge?: SearchPageEdgeResolvers<ContextType>;
  SimpleResponse?: SimpleResponseResolvers<ContextType>;
  Timestamp?: GraphQLScalarType;
  UpdateEdgeMutationError?: UpdateEdgeMutationErrorResolvers<ContextType>;
  UpdateEdgeMutationPayload?: UpdateEdgeMutationPayloadResolvers<ContextType>;
  UpdateEdgeMutationSuccess?: UpdateEdgeMutationSuccessResolvers<ContextType>;
  UserRole?: UserRoleResolvers<ContextType>;
  UserSession?: UserSessionResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
