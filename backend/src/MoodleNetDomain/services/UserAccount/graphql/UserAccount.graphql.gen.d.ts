import { GraphQLResolveInfo } from 'graphql'
import {
  MoodleNetGraphQLContext,
  MoodleNetGraphQLRootValue,
} from '../../../MoodleNetDomain'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> }
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X]
} &
  { [P in K]-?: NonNullable<T[P]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type SimpleResponse = {
  __typename: 'SimpleResponse'
  success: Scalars['Boolean']
  message: Maybe<Scalars['String']>
}

export type RequestConfirmEmailResponse = {
  __typename: 'RequestConfirmEmailResponse'
  flowKey: Maybe<Scalars['String']>
}

export type Session = {
  __typename: 'Session'
  jwt: Maybe<Scalars['String']>
  message: Maybe<Scalars['String']>
}

export type Mutation = {
  __typename: 'Mutation'
  signUp: SimpleResponse
  confirmSignUpEmail: Maybe<RequestConfirmEmailResponse>
  activateAccount: SimpleResponse
  changeEmailRequest: SimpleResponse
  changeEmailConfirm: Scalars['Boolean']
  changePassword: SimpleResponse
  tempSessionByEmail: Maybe<Scalars['String']>
  login: Maybe<Session>
}

export type MutationSignUpArgs = {
  email: Scalars['String']
}

export type MutationConfirmSignUpEmailArgs = {
  token: Scalars['String']
}

export type MutationActivateAccountArgs = {
  username: Scalars['String']
  password: Scalars['String']
  flowKey: Scalars['String']
}

export type MutationChangeEmailRequestArgs = {
  newEmail: Scalars['String']
}

export type MutationChangeEmailConfirmArgs = {
  token: Scalars['String']
}

export type MutationChangePasswordArgs = {
  newPassword: Scalars['String']
}

export type MutationTempSessionByEmailArgs = {
  username: Scalars['String']
  email: Scalars['String']
}

export type MutationLoginArgs = {
  username: Scalars['String']
  password: Scalars['String']
}

export type Query = {
  __typename: 'Query'
  _fake: Maybe<Scalars['Int']>
}

export type ResolverTypeWrapper<T> = Promise<T> | T

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  SimpleResponse: ResolverTypeWrapper<SimpleResponse>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  String: ResolverTypeWrapper<Scalars['String']>
  RequestConfirmEmailResponse: ResolverTypeWrapper<RequestConfirmEmailResponse>
  Session: ResolverTypeWrapper<Session>
  Mutation: ResolverTypeWrapper<MoodleNetGraphQLRootValue>
  Query: ResolverTypeWrapper<MoodleNetGraphQLRootValue>
  Int: ResolverTypeWrapper<Scalars['Int']>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  SimpleResponse: SimpleResponse
  Boolean: Scalars['Boolean']
  String: Scalars['String']
  RequestConfirmEmailResponse: RequestConfirmEmailResponse
  Session: Session
  Mutation: MoodleNetGraphQLRootValue
  Query: MoodleNetGraphQLRootValue
  Int: Scalars['Int']
}

export type SimpleResponseResolvers<
  ContextType = MoodleNetGraphQLContext,
  ParentType extends ResolversParentTypes['SimpleResponse'] = ResolversParentTypes['SimpleResponse']
> = {
  success: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  message: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type RequestConfirmEmailResponseResolvers<
  ContextType = MoodleNetGraphQLContext,
  ParentType extends ResolversParentTypes['RequestConfirmEmailResponse'] = ResolversParentTypes['RequestConfirmEmailResponse']
> = {
  flowKey: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SessionResolvers<
  ContextType = MoodleNetGraphQLContext,
  ParentType extends ResolversParentTypes['Session'] = ResolversParentTypes['Session']
> = {
  jwt: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  message: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type MutationResolvers<
  ContextType = MoodleNetGraphQLContext,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  signUp: Resolver<
    ResolversTypes['SimpleResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationSignUpArgs, 'email'>
  >
  confirmSignUpEmail: Resolver<
    Maybe<ResolversTypes['RequestConfirmEmailResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationConfirmSignUpEmailArgs, 'token'>
  >
  activateAccount: Resolver<
    ResolversTypes['SimpleResponse'],
    ParentType,
    ContextType,
    RequireFields<
      MutationActivateAccountArgs,
      'username' | 'password' | 'flowKey'
    >
  >
  changeEmailRequest: Resolver<
    ResolversTypes['SimpleResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationChangeEmailRequestArgs, 'newEmail'>
  >
  changeEmailConfirm: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationChangeEmailConfirmArgs, 'token'>
  >
  changePassword: Resolver<
    ResolversTypes['SimpleResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationChangePasswordArgs, 'newPassword'>
  >
  tempSessionByEmail: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<MutationTempSessionByEmailArgs, 'username' | 'email'>
  >
  login: Resolver<
    Maybe<ResolversTypes['Session']>,
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, 'username' | 'password'>
  >
}

export type QueryResolvers<
  ContextType = MoodleNetGraphQLContext,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  _fake: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
}

export type Resolvers<ContextType = MoodleNetGraphQLContext> = {
  SimpleResponse: SimpleResponseResolvers<ContextType>
  RequestConfirmEmailResponse: RequestConfirmEmailResponseResolvers<ContextType>
  Session: SessionResolvers<ContextType>
  Mutation: MutationResolvers<ContextType>
  Query: QueryResolvers<ContextType>
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<
  ContextType = MoodleNetGraphQLContext
> = Resolvers<ContextType>
