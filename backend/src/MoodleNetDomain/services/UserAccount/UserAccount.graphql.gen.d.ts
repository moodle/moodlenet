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


export enum AccessLevel {
  Admin = 'ADMIN',
  User = 'USER',
  Owner = 'OWNER'
}

export type SimpleResponse = {
  __typename: 'SimpleResponse';
  success: Scalars['Boolean'];
  message: Maybe<Scalars['String']>;
};

export type RequestConfirmEmailResponse = {
  __typename: 'RequestConfirmEmailResponse';
  flowKey: Maybe<Scalars['String']>;
};

export type Session = {
  __typename: 'Session';
  auth: Maybe<Auth>;
  message: Maybe<Scalars['String']>;
};

export type Auth = {
  __typename: 'Auth';
  jwt: Maybe<Scalars['String']>;
  sessionAccount: Maybe<SessionAccount>;
};

export type SessionAccount = {
  __typename: 'SessionAccount';
  username: Scalars['String'];
  email: Scalars['String'];
  changeEmailRequest: Maybe<Scalars['String']>;
  accountId: Scalars['String'];
};

export type Mutation = {
  __typename: 'Mutation';
  signUp: SimpleResponse;
  activateAccount: Session;
  changeEmailRequest: SimpleResponse;
  changeEmailConfirm: Scalars['Boolean'];
  changePassword: SimpleResponse;
  sessionByEmail: SimpleResponse;
  createSession: Maybe<Session>;
};


export type MutationSignUpArgs = {
  email: Scalars['String'];
};


export type MutationActivateAccountArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
  token: Scalars['String'];
};


export type MutationChangeEmailRequestArgs = {
  newEmail: Scalars['String'];
};


export type MutationChangeEmailConfirmArgs = {
  token: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  currentPassword: Scalars['String'];
};


export type MutationSessionByEmailArgs = {
  username: Scalars['String'];
  email: Scalars['String'];
};


export type MutationCreateSessionArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type Query = {
  __typename: 'Query';
  _null: Maybe<Scalars['Boolean']>;
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
  SimpleResponse: ResolverTypeWrapper<SimpleResponse>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  RequestConfirmEmailResponse: ResolverTypeWrapper<RequestConfirmEmailResponse>;
  Session: ResolverTypeWrapper<Session>;
  Auth: ResolverTypeWrapper<Auth>;
  SessionAccount: ResolverTypeWrapper<SessionAccount>;
  Mutation: ResolverTypeWrapper<RootValue>;
  Query: ResolverTypeWrapper<RootValue>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  SimpleResponse: SimpleResponse;
  Boolean: Scalars['Boolean'];
  String: Scalars['String'];
  RequestConfirmEmailResponse: RequestConfirmEmailResponse;
  Session: Session;
  Auth: Auth;
  SessionAccount: SessionAccount;
  Mutation: RootValue;
  Query: RootValue;
};

export type AccessDirectiveArgs = {   level: Array<AccessLevel>; };

export type AccessDirectiveResolver<Result, Parent, ContextType = Context, Args = AccessDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type SimpleResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SimpleResponse'] = ResolversParentTypes['SimpleResponse']> = {
  success: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RequestConfirmEmailResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RequestConfirmEmailResponse'] = ResolversParentTypes['RequestConfirmEmailResponse']> = {
  flowKey: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SessionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Session'] = ResolversParentTypes['Session']> = {
  auth: Resolver<Maybe<ResolversTypes['Auth']>, ParentType, ContextType>;
  message: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Auth'] = ResolversParentTypes['Auth']> = {
  jwt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sessionAccount: Resolver<Maybe<ResolversTypes['SessionAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SessionAccountResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SessionAccount'] = ResolversParentTypes['SessionAccount']> = {
  username: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  changeEmailRequest: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  accountId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  signUp: Resolver<ResolversTypes['SimpleResponse'], ParentType, ContextType, RequireFields<MutationSignUpArgs, 'email'>>;
  activateAccount: Resolver<ResolversTypes['Session'], ParentType, ContextType, RequireFields<MutationActivateAccountArgs, 'username' | 'password' | 'token'>>;
  changeEmailRequest: Resolver<ResolversTypes['SimpleResponse'], ParentType, ContextType, RequireFields<MutationChangeEmailRequestArgs, 'newEmail'>>;
  changeEmailConfirm: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationChangeEmailConfirmArgs, 'token' | 'password' | 'username'>>;
  changePassword: Resolver<ResolversTypes['SimpleResponse'], ParentType, ContextType, RequireFields<MutationChangePasswordArgs, 'newPassword' | 'currentPassword'>>;
  sessionByEmail: Resolver<ResolversTypes['SimpleResponse'], ParentType, ContextType, RequireFields<MutationSessionByEmailArgs, 'username' | 'email'>>;
  createSession: Resolver<Maybe<ResolversTypes['Session']>, ParentType, ContextType, RequireFields<MutationCreateSessionArgs, 'username' | 'password'>>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  _null: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  SimpleResponse: SimpleResponseResolvers<ContextType>;
  RequestConfirmEmailResponse: RequestConfirmEmailResponseResolvers<ContextType>;
  Session: SessionResolvers<ContextType>;
  Auth: AuthResolvers<ContextType>;
  SessionAccount: SessionAccountResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
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