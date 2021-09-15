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
  Bookmarked: ResolverTypeWrapper<Types.Bookmarked>;
  ID: ResolverTypeWrapper<Types.Scalars['ID']>;
  Collection: ResolverTypeWrapper<Types.Collection>;
  Boolean: ResolverTypeWrapper<Types.Scalars['Boolean']>;
  Int: ResolverTypeWrapper<Types.Scalars['Int']>;
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
  Edge: ResolversTypes['Bookmarked'] | ResolversTypes['Created'] | ResolversTypes['Features'] | ResolversTypes['Follows'] | ResolversTypes['Likes'] | ResolversTypes['Pinned'];
  EdgeType: Types.EdgeType;
  EditCollectionInput: Types.EditCollectionInput;
  EditEdgeInput: Types.EditEdgeInput;
  EditEdgeMutationError: ResolverTypeWrapper<Types.EditEdgeMutationError>;
  EditEdgeMutationErrorType: Types.EditEdgeMutationErrorType;
  EditEdgeMutationPayload: ResolversTypes['EditEdgeMutationSuccess'] | ResolversTypes['EditEdgeMutationError'];
  EditEdgeMutationSuccess: ResolverTypeWrapper<Omit<Types.EditEdgeMutationSuccess, 'edge'> & { edge?: Types.Maybe<ResolversTypes['Edge']> }>;
  EditNodeInput: Types.EditNodeInput;
  EditNodeMutationError: ResolverTypeWrapper<Types.EditNodeMutationError>;
  EditNodeMutationErrorType: Types.EditNodeMutationErrorType;
  EditNodeMutationPayload: ResolversTypes['EditNodeMutationSuccess'] | ResolversTypes['EditNodeMutationError'];
  EditNodeMutationSuccess: ResolverTypeWrapper<Omit<Types.EditNodeMutationSuccess, 'node'> & { node?: Types.Maybe<ResolversTypes['Node']> }>;
  EditProfileInput: Types.EditProfileInput;
  EditResourceInput: Types.EditResourceInput;
  Empty: ResolverTypeWrapper<Types.Scalars['Empty']>;
  Features: ResolverTypeWrapper<Types.Features>;
  FileFormat: ResolverTypeWrapper<Types.FileFormat>;
  FileFormatType: Types.FileFormatType;
  Follows: ResolverTypeWrapper<Types.Follows>;
  GlobalSearchNodeType: Types.GlobalSearchNodeType;
  GlobalSearchSort: Types.GlobalSearchSort;
  GlobalSearchSortBy: Types.GlobalSearchSortBy;
  IEdge: ResolversTypes['Bookmarked'] | ResolversTypes['Created'] | ResolversTypes['Features'] | ResolversTypes['Follows'] | ResolversTypes['Likes'] | ResolversTypes['Pinned'];
  INode: ResolversTypes['Collection'] | ResolversTypes['FileFormat'] | ResolversTypes['IscedField'] | ResolversTypes['IscedGrade'] | ResolversTypes['Language'] | ResolversTypes['License'] | ResolversTypes['Organization'] | ResolversTypes['Profile'] | ResolversTypes['Resource'] | ResolversTypes['ResourceType'];
  IscedField: ResolverTypeWrapper<Types.IscedField>;
  IscedGrade: ResolverTypeWrapper<Types.IscedGrade>;
  Language: ResolverTypeWrapper<Types.Language>;
  License: ResolverTypeWrapper<Types.License>;
  Likes: ResolverTypeWrapper<Types.Likes>;
  Mutation: ResolverTypeWrapper<RootValue>;
  Never: ResolverTypeWrapper<Types.Scalars['Never']>;
  Node: ResolversTypes['Collection'] | ResolversTypes['FileFormat'] | ResolversTypes['IscedField'] | ResolversTypes['IscedGrade'] | ResolversTypes['Language'] | ResolversTypes['License'] | ResolversTypes['Organization'] | ResolversTypes['Profile'] | ResolversTypes['Resource'] | ResolversTypes['ResourceType'];
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
  ResourceType: ResolverTypeWrapper<Types.ResourceType>;
  SearchPage: ResolverTypeWrapper<Types.SearchPage>;
  SearchPageEdge: ResolverTypeWrapper<Types.SearchPageEdge>;
  SimpleResponse: ResolverTypeWrapper<Types.SimpleResponse>;
  Timestamp: ResolverTypeWrapper<Types.Scalars['Timestamp']>;
  UserSession: ResolverTypeWrapper<Types.UserSession>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AssetRef: Types.Scalars['AssetRef'];
  AssetRefInput: Types.AssetRefInput;
  String: Types.Scalars['String'];
  Bookmarked: Types.Bookmarked;
  ID: Types.Scalars['ID'];
  Collection: Types.Collection;
  Boolean: Types.Scalars['Boolean'];
  Int: Types.Scalars['Int'];
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
  Edge: ResolversParentTypes['Bookmarked'] | ResolversParentTypes['Created'] | ResolversParentTypes['Features'] | ResolversParentTypes['Follows'] | ResolversParentTypes['Likes'] | ResolversParentTypes['Pinned'];
  EditCollectionInput: Types.EditCollectionInput;
  EditEdgeInput: Types.EditEdgeInput;
  EditEdgeMutationError: Types.EditEdgeMutationError;
  EditEdgeMutationPayload: ResolversParentTypes['EditEdgeMutationSuccess'] | ResolversParentTypes['EditEdgeMutationError'];
  EditEdgeMutationSuccess: Omit<Types.EditEdgeMutationSuccess, 'edge'> & { edge?: Types.Maybe<ResolversParentTypes['Edge']> };
  EditNodeInput: Types.EditNodeInput;
  EditNodeMutationError: Types.EditNodeMutationError;
  EditNodeMutationPayload: ResolversParentTypes['EditNodeMutationSuccess'] | ResolversParentTypes['EditNodeMutationError'];
  EditNodeMutationSuccess: Omit<Types.EditNodeMutationSuccess, 'node'> & { node?: Types.Maybe<ResolversParentTypes['Node']> };
  EditProfileInput: Types.EditProfileInput;
  EditResourceInput: Types.EditResourceInput;
  Empty: Types.Scalars['Empty'];
  Features: Types.Features;
  FileFormat: Types.FileFormat;
  Follows: Types.Follows;
  GlobalSearchSort: Types.GlobalSearchSort;
  IEdge: ResolversParentTypes['Bookmarked'] | ResolversParentTypes['Created'] | ResolversParentTypes['Features'] | ResolversParentTypes['Follows'] | ResolversParentTypes['Likes'] | ResolversParentTypes['Pinned'];
  INode: ResolversParentTypes['Collection'] | ResolversParentTypes['FileFormat'] | ResolversParentTypes['IscedField'] | ResolversParentTypes['IscedGrade'] | ResolversParentTypes['Language'] | ResolversParentTypes['License'] | ResolversParentTypes['Organization'] | ResolversParentTypes['Profile'] | ResolversParentTypes['Resource'] | ResolversParentTypes['ResourceType'];
  IscedField: Types.IscedField;
  IscedGrade: Types.IscedGrade;
  Language: Types.Language;
  License: Types.License;
  Likes: Types.Likes;
  Mutation: RootValue;
  Never: Types.Scalars['Never'];
  Node: ResolversParentTypes['Collection'] | ResolversParentTypes['FileFormat'] | ResolversParentTypes['IscedField'] | ResolversParentTypes['IscedGrade'] | ResolversParentTypes['Language'] | ResolversParentTypes['License'] | ResolversParentTypes['Organization'] | ResolversParentTypes['Profile'] | ResolversParentTypes['Resource'] | ResolversParentTypes['ResourceType'];
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
  ResourceType: Types.ResourceType;
  SearchPage: Types.SearchPage;
  SearchPageEdge: Types.SearchPageEdge;
  SimpleResponse: Types.SimpleResponse;
  Timestamp: Types.Scalars['Timestamp'];
  UserSession: Types.UserSession;
};

export interface AssetRefScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AssetRef'], any> {
  name: 'AssetRef';
}

export type BookmarkedResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Bookmarked'] = ResolversParentTypes['Bookmarked']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _created?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Collection'] = ResolversParentTypes['Collection']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<Types.Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Types.Collection_RelArgs, 'type' | 'target'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Types.Collection_RelCountArgs, 'type' | 'target'>>;
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
  edgeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
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
  __resolveType?: TypeResolveFn<'Bookmarked' | 'Created' | 'Features' | 'Follows' | 'Likes' | 'Pinned', ParentType, ContextType>;
};

export type EditEdgeMutationErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EditEdgeMutationError'] = ResolversParentTypes['EditEdgeMutationError']> = {
  type?: Resolver<ResolversTypes['EditEdgeMutationErrorType'], ParentType, ContextType>;
  details?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EditEdgeMutationPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EditEdgeMutationPayload'] = ResolversParentTypes['EditEdgeMutationPayload']> = {
  __resolveType?: TypeResolveFn<'EditEdgeMutationSuccess' | 'EditEdgeMutationError', ParentType, ContextType>;
};

export type EditEdgeMutationSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EditEdgeMutationSuccess'] = ResolversParentTypes['EditEdgeMutationSuccess']> = {
  edge?: Resolver<Types.Maybe<ResolversTypes['Edge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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

export type FeaturesResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Features'] = ResolversParentTypes['Features']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _created?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FileFormatResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FileFormat'] = ResolversParentTypes['FileFormat']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['FileFormatType'], ParentType, ContextType>;
  subtype?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Types.FileFormat_RelArgs, 'type' | 'target'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Types.FileFormat_RelCountArgs, 'type' | 'target'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FollowsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Follows'] = ResolversParentTypes['Follows']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _created?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['IEdge'] = ResolversParentTypes['IEdge']> = {
  __resolveType?: TypeResolveFn<'Bookmarked' | 'Created' | 'Features' | 'Follows' | 'Likes' | 'Pinned', ParentType, ContextType>;
  id?: Resolver<Types.Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  _created?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
};

export type INodeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['INode'] = ResolversParentTypes['INode']> = {
  __resolveType?: TypeResolveFn<'Collection' | 'FileFormat' | 'IscedField' | 'IscedGrade' | 'Language' | 'License' | 'Organization' | 'Profile' | 'Resource' | 'ResourceType', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Types.INode_RelArgs, 'type' | 'target'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Types.INode_RelCountArgs, 'type' | 'target'>>;
};

export type IscedFieldResolvers<ContextType = Context, ParentType extends ResolversParentTypes['IscedField'] = ResolversParentTypes['IscedField']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  codePath?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<Types.Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Types.IscedField_RelArgs, 'type' | 'target'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Types.IscedField_RelCountArgs, 'type' | 'target'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IscedGradeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['IscedGrade'] = ResolversParentTypes['IscedGrade']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  codePath?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<Types.Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Types.IscedGrade_RelArgs, 'type' | 'target'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Types.IscedGrade_RelCountArgs, 'type' | 'target'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LanguageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Language'] = ResolversParentTypes['Language']> = {
  part2b?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  part2t?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  part1?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  scope?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  langType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Types.Language_RelArgs, 'type' | 'target'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Types.Language_RelCountArgs, 'type' | 'target'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LicenseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['License'] = ResolversParentTypes['License']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Types.License_RelArgs, 'type' | 'target'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Types.License_RelCountArgs, 'type' | 'target'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LikesResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Likes'] = ResolversParentTypes['Likes']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _created?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  changeRecoverPassword?: Resolver<Types.Maybe<ResolversTypes['CreateSession']>, ParentType, ContextType, RequireFields<Types.MutationChangeRecoverPasswordArgs, 'newPassword' | 'token'>>;
  createEdge?: Resolver<ResolversTypes['CreateEdgeMutationPayload'], ParentType, ContextType, RequireFields<Types.MutationCreateEdgeArgs, 'input'>>;
  createNode?: Resolver<ResolversTypes['CreateNodeMutationPayload'], ParentType, ContextType, RequireFields<Types.MutationCreateNodeArgs, 'input'>>;
  createSession?: Resolver<ResolversTypes['CreateSession'], ParentType, ContextType, RequireFields<Types.MutationCreateSessionArgs, 'email' | 'password'>>;
  deleteEdge?: Resolver<ResolversTypes['DeleteEdgeMutationPayload'], ParentType, ContextType, RequireFields<Types.MutationDeleteEdgeArgs, 'input'>>;
  deleteNode?: Resolver<ResolversTypes['DeleteNodeMutationPayload'], ParentType, ContextType, RequireFields<Types.MutationDeleteNodeArgs, 'input'>>;
  editNode?: Resolver<ResolversTypes['EditNodeMutationPayload'], ParentType, ContextType, RequireFields<Types.MutationEditNodeArgs, 'input'>>;
  recoverPassword?: Resolver<ResolversTypes['SimpleResponse'], ParentType, ContextType, RequireFields<Types.MutationRecoverPasswordArgs, 'email'>>;
  sendEmailToProfile?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<Types.MutationSendEmailToProfileArgs, 'text' | 'toProfileId'>>;
  signUp?: Resolver<ResolversTypes['SimpleResponse'], ParentType, ContextType, RequireFields<Types.MutationSignUpArgs, 'email' | 'name' | 'password'>>;
};

export interface NeverScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Never'], any> {
  name: 'Never';
}

export type NodeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType?: TypeResolveFn<'Collection' | 'FileFormat' | 'IscedField' | 'IscedGrade' | 'Language' | 'License' | 'Organization' | 'Profile' | 'Resource' | 'ResourceType', ParentType, ContextType>;
};

export type OrganizationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Organization'] = ResolversParentTypes['Organization']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  avatar?: Resolver<Types.Maybe<ResolversTypes['AssetRef']>, ParentType, ContextType>;
  bio?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  globalSearch?: Resolver<ResolversTypes['SearchPage'], ParentType, ContextType, RequireFields<Types.QueryGlobalSearchArgs, 'text'>>;
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
  content?: Resolver<ResolversTypes['AssetRef'], ParentType, ContextType>;
  kind?: Resolver<ResolversTypes['ResourceKind'], ParentType, ContextType>;
  originalCreationDate?: Resolver<Types.Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Types.Resource_RelArgs, 'type' | 'target'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Types.Resource_RelCountArgs, 'type' | 'target'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResourceTypeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ResourceType'] = ResolversParentTypes['ResourceType']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  _rel?: Resolver<ResolversTypes['RelPage'], ParentType, ContextType, RequireFields<Types.ResourceType_RelArgs, 'type' | 'target'>>;
  _relCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Types.ResourceType_RelCountArgs, 'type' | 'target'>>;
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

export type UserSessionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserSession'] = ResolversParentTypes['UserSession']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  profile?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  AssetRef?: GraphQLScalarType;
  Bookmarked?: BookmarkedResolvers<ContextType>;
  Collection?: CollectionResolvers<ContextType>;
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
  EditEdgeMutationError?: EditEdgeMutationErrorResolvers<ContextType>;
  EditEdgeMutationPayload?: EditEdgeMutationPayloadResolvers<ContextType>;
  EditEdgeMutationSuccess?: EditEdgeMutationSuccessResolvers<ContextType>;
  EditNodeMutationError?: EditNodeMutationErrorResolvers<ContextType>;
  EditNodeMutationPayload?: EditNodeMutationPayloadResolvers<ContextType>;
  EditNodeMutationSuccess?: EditNodeMutationSuccessResolvers<ContextType>;
  Empty?: GraphQLScalarType;
  Features?: FeaturesResolvers<ContextType>;
  FileFormat?: FileFormatResolvers<ContextType>;
  Follows?: FollowsResolvers<ContextType>;
  IEdge?: IEdgeResolvers<ContextType>;
  INode?: INodeResolvers<ContextType>;
  IscedField?: IscedFieldResolvers<ContextType>;
  IscedGrade?: IscedGradeResolvers<ContextType>;
  Language?: LanguageResolvers<ContextType>;
  License?: LicenseResolvers<ContextType>;
  Likes?: LikesResolvers<ContextType>;
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
  ResourceType?: ResourceTypeResolvers<ContextType>;
  SearchPage?: SearchPageResolvers<ContextType>;
  SearchPageEdge?: SearchPageEdgeResolvers<ContextType>;
  SimpleResponse?: SimpleResponseResolvers<ContextType>;
  Timestamp?: GraphQLScalarType;
  UserSession?: UserSessionResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
