import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { MoodleNetExecutionContext, RootValue } from '../../MoodleNetGraphQL';
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
  Never: never;
  Empty: {};
  DateTime: Date;
};




export type Mutation = {
  __typename: 'Mutation';
  signUp: SimpleResponse;
  changeEmailRequest: SimpleResponse;
  changeEmailConfirm: Scalars['Boolean'];
  changePassword: SimpleResponse;
  activateAccount: ActivationOutcome;
  sessionByEmail: SimpleResponse;
  createSession: Maybe<UserSession>;
};


export type MutationSignUpArgs = {
  email: Scalars['String'];
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


export type MutationActivateAccountArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
  token: Scalars['String'];
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
  _null_placeholder: Maybe<Scalars['Boolean']>;
};

export type SimpleResponse = {
  __typename: 'SimpleResponse';
  success: Scalars['Boolean'];
  message: Maybe<Scalars['String']>;
};

export type UserSession = {
  __typename: 'UserSession';
  username: Scalars['String'];
  email: Scalars['String'];
  changeEmailRequest: Maybe<Scalars['String']>;
  accountId: Scalars['String'];
  jwt: Scalars['String'];
};

export type ActivationOutcome = {
  __typename: 'ActivationOutcome';
  session: Maybe<UserSession>;
  message: Maybe<Scalars['String']>;
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
  Never: ResolverTypeWrapper<Scalars['Never']>;
  Empty: ResolverTypeWrapper<Scalars['Empty']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Mutation: ResolverTypeWrapper<RootValue>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Query: ResolverTypeWrapper<RootValue>;
  SimpleResponse: ResolverTypeWrapper<SimpleResponse>;
  UserSession: ResolverTypeWrapper<UserSession>;
  ActivationOutcome: ResolverTypeWrapper<ActivationOutcome>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Never: Scalars['Never'];
  Empty: Scalars['Empty'];
  DateTime: Scalars['DateTime'];
  Mutation: RootValue;
  String: Scalars['String'];
  Boolean: Scalars['Boolean'];
  Query: RootValue;
  SimpleResponse: SimpleResponse;
  UserSession: UserSession;
  ActivationOutcome: ActivationOutcome;
};

export interface NeverScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Never'], any> {
  name: 'Never';
}

export interface EmptyScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Empty'], any> {
  name: 'Empty';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type MutationResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  signUp: Resolver<ResolversTypes['SimpleResponse'], ParentType, ContextType, RequireFields<MutationSignUpArgs, 'email'>>;
  changeEmailRequest: Resolver<ResolversTypes['SimpleResponse'], ParentType, ContextType, RequireFields<MutationChangeEmailRequestArgs, 'newEmail'>>;
  changeEmailConfirm: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationChangeEmailConfirmArgs, 'token' | 'password' | 'username'>>;
  changePassword: Resolver<ResolversTypes['SimpleResponse'], ParentType, ContextType, RequireFields<MutationChangePasswordArgs, 'newPassword' | 'currentPassword'>>;
  activateAccount: Resolver<ResolversTypes['ActivationOutcome'], ParentType, ContextType, RequireFields<MutationActivateAccountArgs, 'username' | 'password' | 'token'>>;
  sessionByEmail: Resolver<ResolversTypes['SimpleResponse'], ParentType, ContextType, RequireFields<MutationSessionByEmailArgs, 'username' | 'email'>>;
  createSession: Resolver<Maybe<ResolversTypes['UserSession']>, ParentType, ContextType, RequireFields<MutationCreateSessionArgs, 'username' | 'password'>>;
};

export type QueryResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  _null_placeholder: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type SimpleResponseResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['SimpleResponse'] = ResolversParentTypes['SimpleResponse']> = {
  success: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSessionResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['UserSession'] = ResolversParentTypes['UserSession']> = {
  username: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  changeEmailRequest: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  accountId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  jwt: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActivationOutcomeResolvers<ContextType = MoodleNetExecutionContext, ParentType extends ResolversParentTypes['ActivationOutcome'] = ResolversParentTypes['ActivationOutcome']> = {
  session: Resolver<Maybe<ResolversTypes['UserSession']>, ParentType, ContextType>;
  message: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = MoodleNetExecutionContext> = {
  Never: GraphQLScalarType;
  Empty: GraphQLScalarType;
  DateTime: GraphQLScalarType;
  Mutation: MutationResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  SimpleResponse: SimpleResponseResolvers<ContextType>;
  UserSession: UserSessionResolvers<ContextType>;
  ActivationOutcome: ActivationOutcomeResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = MoodleNetExecutionContext> = Resolvers<ContextType>;
