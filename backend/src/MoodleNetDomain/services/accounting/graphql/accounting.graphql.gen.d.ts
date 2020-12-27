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
  jwt: Maybe<Scalars['String']>;
  message: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename: 'Mutation';
  accountSignUp: SimpleResponse;
  accountRequestConfirmEmail: Maybe<RequestConfirmEmailResponse>;
  accountRequestActivateAccount: SimpleResponse;
  accountChangeEmailRequest: SimpleResponse;
  accountChangeEmailConfirm: Scalars['Boolean'];
  accountChangePassword: SimpleResponse;
  accountTempSessionEmail: Maybe<Scalars['String']>;
  accountLogin: Maybe<Session>;
};


export type MutationAccountSignUpArgs = {
  email: Scalars['String'];
};


export type MutationAccountRequestConfirmEmailArgs = {
  token: Scalars['String'];
};


export type MutationAccountRequestActivateAccountArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
  flowKey: Scalars['String'];
};


export type MutationAccountChangeEmailRequestArgs = {
  newEmail: Scalars['String'];
};


export type MutationAccountChangeEmailConfirmArgs = {
  token: Scalars['String'];
};


export type MutationAccountChangePasswordArgs = {
  newPassword: Scalars['String'];
};


export type MutationAccountTempSessionEmailArgs = {
  username: Scalars['String'];
  email: Scalars['String'];
};


export type MutationAccountLoginArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
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
  SimpleResponse: ResolverTypeWrapper<SimpleResponse>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  RequestConfirmEmailResponse: ResolverTypeWrapper<RequestConfirmEmailResponse>;
  Session: ResolverTypeWrapper<Session>;
  Mutation: ResolverTypeWrapper<RootValue>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  SimpleResponse: SimpleResponse;
  Boolean: Scalars['Boolean'];
  String: Scalars['String'];
  RequestConfirmEmailResponse: RequestConfirmEmailResponse;
  Session: Session;
  Mutation: RootValue;
};

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
  jwt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  accountSignUp: Resolver<ResolversTypes['SimpleResponse'], ParentType, ContextType, RequireFields<MutationAccountSignUpArgs, 'email'>>;
  accountRequestConfirmEmail: Resolver<Maybe<ResolversTypes['RequestConfirmEmailResponse']>, ParentType, ContextType, RequireFields<MutationAccountRequestConfirmEmailArgs, 'token'>>;
  accountRequestActivateAccount: Resolver<ResolversTypes['SimpleResponse'], ParentType, ContextType, RequireFields<MutationAccountRequestActivateAccountArgs, 'username' | 'password' | 'flowKey'>>;
  accountChangeEmailRequest: Resolver<ResolversTypes['SimpleResponse'], ParentType, ContextType, RequireFields<MutationAccountChangeEmailRequestArgs, 'newEmail'>>;
  accountChangeEmailConfirm: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationAccountChangeEmailConfirmArgs, 'token'>>;
  accountChangePassword: Resolver<ResolversTypes['SimpleResponse'], ParentType, ContextType, RequireFields<MutationAccountChangePasswordArgs, 'newPassword'>>;
  accountTempSessionEmail: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationAccountTempSessionEmailArgs, 'username' | 'email'>>;
  accountLogin: Resolver<Maybe<ResolversTypes['Session']>, ParentType, ContextType, RequireFields<MutationAccountLoginArgs, 'username' | 'password'>>;
};

export type Resolvers<ContextType = Context> = {
  SimpleResponse: SimpleResponseResolvers<ContextType>;
  RequestConfirmEmailResponse: RequestConfirmEmailResponseResolvers<ContextType>;
  Session: SessionResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
