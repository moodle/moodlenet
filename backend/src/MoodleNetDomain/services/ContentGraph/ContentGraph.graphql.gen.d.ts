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

export type GraphVertex = {
  _id: Scalars['ID'];
};

export type GraphEdge = {
  _id: Scalars['ID'];
  node: GraphVertex;
};

export type GraphPageEdge = {
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
  edges: Array<GraphPageEdge>;
};

export type PageInput = {
  first: Maybe<Scalars['Int']>;
  after: Maybe<Scalars['String']>;
  before: Maybe<Scalars['String']>;
  last: Maybe<Scalars['Int']>;
};

export type Collection = GraphVertex & {
  __typename: 'Collection';
  _id: Scalars['ID'];
  containsResources: CollectionContainsResourcePage;
  followers: CollectionFollowersPage;
  name: Scalars['String'];
  subjectReferences: CollectionReferencesSubjectPage;
};


export type CollectionContainsResourcesArgs = {
  page: Maybe<PageInput>;
};


export type CollectionFollowersArgs = {
  page: Maybe<PageInput>;
};


export type CollectionSubjectReferencesArgs = {
  page: Maybe<PageInput>;
};

export type Query = {
  __typename: 'Query';
  collection: Maybe<Collection>;
  getSessionAccountUser: Maybe<SessionAccount>;
  resource: Maybe<Resource>;
  subject: Maybe<Subject>;
  user: Maybe<User>;
};


export type QueryCollectionArgs = {
  _id: Scalars['ID'];
};


export type QueryGetSessionAccountUserArgs = {
  username: Scalars['String'];
};


export type QueryResourceArgs = {
  _id: Scalars['ID'];
};


export type QuerySubjectArgs = {
  _id: Scalars['ID'];
};


export type QueryUserArgs = {
  _id: Scalars['ID'];
};

export type CreateCollectionInput = {
  name: Scalars['String'];
};

export type Mutation = {
  __typename: 'Mutation';
  collectionReferencesSubject: Maybe<CollectionReferencesSubject>;
  containResource: Maybe<CollectionContainsResource>;
  createCollection: Collection;
  createResource: Resource;
  createSubject: Maybe<Subject>;
  followCollection: Maybe<UserFollowsCollection>;
  followSubject: Maybe<UserFollowsSubject>;
  likeResource: Maybe<UserLikesResource>;
  resourceReferencesSubject: Maybe<ResourceReferencesSubject>;
};


export type MutationCollectionReferencesSubjectArgs = {
  collectionId: Maybe<Scalars['ID']>;
  subjectId: Maybe<Scalars['ID']>;
};


export type MutationContainResourceArgs = {
  resourceId: Maybe<Scalars['ID']>;
};


export type MutationCreateCollectionArgs = {
  collection: Maybe<CreateCollectionInput>;
};


export type MutationCreateResourceArgs = {
  resource: Maybe<CreateResourceInput>;
};


export type MutationCreateSubjectArgs = {
  subjectInput: CreateSubjectInput;
};


export type MutationFollowCollectionArgs = {
  collectionId: Maybe<Scalars['ID']>;
};


export type MutationFollowSubjectArgs = {
  subjectId: Maybe<Scalars['ID']>;
};


export type MutationLikeResourceArgs = {
  resourceId: Maybe<Scalars['ID']>;
};


export type MutationResourceReferencesSubjectArgs = {
  resourceId: Maybe<Scalars['ID']>;
  subjectId: Maybe<Scalars['ID']>;
};

export type ICollectionContainsResource = {
  node: Resource;
};

export type CollectionContainsResource = GraphEdge & Contains & ICollectionContainsResource & {
  __typename: 'CollectionContainsResource';
  _id: Scalars['ID'];
  node: Resource;
};

export type CollectionContainsResourceEdge = GraphPageEdge & Contains & ICollectionContainsResource & {
  __typename: 'CollectionContainsResourceEdge';
  _id: Scalars['ID'];
  cursor: Scalars['String'];
  node: Resource;
};

export type CollectionContainsResourcePage = Page & {
  __typename: 'CollectionContainsResourcePage';
  pageInfo: PageInfo;
  edges: Array<CollectionContainsResourceEdge>;
};

export type Contains = {
  _id: Scalars['ID'];
};

export type IResourceContainer = {
  node: Collection;
};

export type ResourceContainer = GraphEdge & IResourceContainer & Contains & {
  __typename: 'ResourceContainer';
  _id: Scalars['ID'];
  node: Collection;
};

export type ResourceContainerEdge = GraphPageEdge & IResourceContainer & Contains & {
  __typename: 'ResourceContainerEdge';
  _id: Scalars['ID'];
  cursor: Scalars['String'];
  node: Collection;
};

export type ResourceContainersPage = Page & {
  __typename: 'ResourceContainersPage';
  pageInfo: PageInfo;
  edges: Array<ResourceContainerEdge>;
};

export type Resource = GraphVertex & {
  __typename: 'Resource';
  _id: Scalars['ID'];
  containers: ResourceContainersPage;
  likers: ResourceLikersPage;
  name: Scalars['String'];
  subjectReferences: ResourceReferencesSubjectPage;
};


export type ResourceContainersArgs = {
  page: Maybe<PageInput>;
};


export type ResourceLikersArgs = {
  page: Maybe<PageInput>;
};


export type ResourceSubjectReferencesArgs = {
  page: Maybe<PageInput>;
};

export type ICollectionFollower = {
  node: User;
};

export type CollectionFollower = GraphEdge & ICollectionFollower & Follows & {
  __typename: 'CollectionFollower';
  _id: Scalars['ID'];
  node: User;
};

export type CollectionFollowerEdge = GraphPageEdge & ICollectionFollower & Follows & {
  __typename: 'CollectionFollowerEdge';
  _id: Scalars['ID'];
  cursor: Scalars['String'];
  node: User;
};

export type CollectionFollowersPage = Page & {
  __typename: 'CollectionFollowersPage';
  pageInfo: PageInfo;
  edges: Array<CollectionFollowerEdge>;
};

export type Follows = {
  _id: Scalars['ID'];
};

export type ISubjectFollower = {
  node: User;
};

export type SubjectFollower = GraphEdge & ISubjectFollower & Follows & {
  __typename: 'SubjectFollower';
  _id: Scalars['ID'];
  node: User;
};

export type SubjectFollowerEdge = GraphPageEdge & ISubjectFollower & Follows & {
  __typename: 'SubjectFollowerEdge';
  _id: Scalars['ID'];
  cursor: Scalars['String'];
  node: User;
};

export type SubjectFollowersPage = Page & {
  __typename: 'SubjectFollowersPage';
  pageInfo: PageInfo;
  edges: Array<SubjectFollowerEdge>;
};

export type Subject = GraphVertex & {
  __typename: 'Subject';
  _id: Scalars['ID'];
  collectionReferences: SubjectCollectionReferencesPage;
  followers: SubjectFollowersPage;
  name: Scalars['String'];
  resourceReferences: SubjectResourceReferencesPage;
};


export type SubjectCollectionReferencesArgs = {
  page: Maybe<PageInput>;
};


export type SubjectFollowersArgs = {
  page: Maybe<PageInput>;
};


export type SubjectResourceReferencesArgs = {
  page: Maybe<PageInput>;
};

export type IUserFollower = {
  node: User;
};

export type UserFollower = GraphEdge & Follows & IUserFollower & {
  __typename: 'UserFollower';
  _id: Scalars['ID'];
  node: User;
};

export type UserFollowerEdge = GraphPageEdge & Follows & IUserFollower & {
  __typename: 'UserFollowerEdge';
  _id: Scalars['ID'];
  cursor: Scalars['String'];
  node: User;
};

export type UserFollowerPage = Page & {
  __typename: 'UserFollowerPage';
  pageInfo: PageInfo;
  edges: Array<UserFollowerEdge>;
};

export type User = GraphVertex & {
  __typename: 'User';
  _id: Scalars['ID'];
  displayName: Scalars['String'];
  followers: UserFollowerPage;
  followsCollections: UserFollowsCollectionPage;
  followsSubjects: UserFollowsSubjectPage;
  followsUsers: UserFollowsUserPage;
  likesResources: UserLikesResourcePage;
};


export type UserFollowersArgs = {
  page: Maybe<PageInput>;
};


export type UserFollowsCollectionsArgs = {
  page: Maybe<PageInput>;
};


export type UserFollowsSubjectsArgs = {
  page: Maybe<PageInput>;
};


export type UserFollowsUsersArgs = {
  page: Maybe<PageInput>;
};


export type UserLikesResourcesArgs = {
  page: Maybe<PageInput>;
};

export type IUserFollowsCollection = {
  node: Collection;
};

export type UserFollowsCollection = GraphEdge & Follows & IUserFollowsCollection & {
  __typename: 'UserFollowsCollection';
  _id: Scalars['ID'];
  node: Collection;
};

export type UserFollowsCollectionEdge = GraphPageEdge & Follows & IUserFollowsCollection & {
  __typename: 'UserFollowsCollectionEdge';
  _id: Scalars['ID'];
  cursor: Scalars['String'];
  node: Collection;
};

export type UserFollowsCollectionPage = Page & {
  __typename: 'UserFollowsCollectionPage';
  pageInfo: PageInfo;
  edges: Array<UserFollowsCollectionEdge>;
};

export type IUserFollowsSubject = {
  node: Subject;
};

export type UserFollowsSubject = GraphEdge & Follows & IUserFollowsSubject & {
  __typename: 'UserFollowsSubject';
  _id: Scalars['ID'];
  node: Subject;
};

export type UserFollowsSubjectEdge = GraphPageEdge & Follows & IUserFollowsSubject & {
  __typename: 'UserFollowsSubjectEdge';
  _id: Scalars['ID'];
  cursor: Scalars['String'];
  node: Subject;
};

export type UserFollowsSubjectPage = Page & {
  __typename: 'UserFollowsSubjectPage';
  pageInfo: PageInfo;
  edges: Array<UserFollowsSubjectEdge>;
};

export type IUserFollowsUser = {
  node: User;
};

export type UserFollowsUser = GraphEdge & Follows & IUserFollowsUser & {
  __typename: 'UserFollowsUser';
  _id: Scalars['ID'];
  node: User;
};

export type UserFollowsUserEdge = GraphPageEdge & Follows & IUserFollowsUser & {
  __typename: 'UserFollowsUserEdge';
  _id: Scalars['ID'];
  cursor: Scalars['String'];
  node: User;
};

export type UserFollowsUserPage = Page & {
  __typename: 'UserFollowsUserPage';
  pageInfo: PageInfo;
  edges: Array<UserFollowsUserEdge>;
};

export type Likes = {
  _id: Scalars['ID'];
};

export type IResourceLiker = {
  node: User;
};

export type ResourceLiker = GraphEdge & IResourceLiker & Likes & {
  __typename: 'ResourceLiker';
  _id: Scalars['ID'];
  node: User;
};

export type ResourceLikerEdge = GraphPageEdge & IResourceLiker & Likes & {
  __typename: 'ResourceLikerEdge';
  _id: Scalars['ID'];
  cursor: Scalars['String'];
  node: User;
};

export type ResourceLikersPage = Page & {
  __typename: 'ResourceLikersPage';
  pageInfo: PageInfo;
  edges: Array<ResourceLikerEdge>;
};

export type IUserLikesResource = {
  node: Resource;
};

export type UserLikesResource = GraphEdge & Likes & IUserLikesResource & {
  __typename: 'UserLikesResource';
  _id: Scalars['ID'];
  node: Resource;
};

export type UserLikesResourceEdge = GraphPageEdge & Likes & IUserLikesResource & {
  __typename: 'UserLikesResourceEdge';
  _id: Scalars['ID'];
  cursor: Scalars['String'];
  node: Resource;
};

export type UserLikesResourcePage = Page & {
  __typename: 'UserLikesResourcePage';
  pageInfo: PageInfo;
  edges: Array<UserLikesResourceEdge>;
};

export type ICollectionReferencesSubject = {
  node: Subject;
};

export type CollectionReferencesSubject = GraphEdge & References & ICollectionReferencesSubject & {
  __typename: 'CollectionReferencesSubject';
  _id: Scalars['ID'];
  node: Subject;
};

export type CollectionReferencesSubjectEdge = GraphPageEdge & References & ICollectionReferencesSubject & {
  __typename: 'CollectionReferencesSubjectEdge';
  _id: Scalars['ID'];
  cursor: Scalars['String'];
  node: Subject;
};

export type CollectionReferencesSubjectPage = Page & {
  __typename: 'CollectionReferencesSubjectPage';
  pageInfo: PageInfo;
  edges: Array<CollectionReferencesSubjectEdge>;
};

export type References = {
  _id: Scalars['ID'];
};

export type IResourceReferencesSubject = {
  node: Subject;
};

export type ResourceReferencesSubject = GraphEdge & References & IResourceReferencesSubject & {
  __typename: 'ResourceReferencesSubject';
  _id: Scalars['ID'];
  node: Subject;
};

export type ResourceReferencesSubjectEdge = GraphPageEdge & References & IResourceReferencesSubject & {
  __typename: 'ResourceReferencesSubjectEdge';
  _id: Scalars['ID'];
  cursor: Scalars['String'];
  node: Subject;
};

export type ResourceReferencesSubjectPage = Page & {
  __typename: 'ResourceReferencesSubjectPage';
  pageInfo: PageInfo;
  edges: Array<ResourceReferencesSubjectEdge>;
};

export type ISubjectCollectionReference = {
  node: User;
};

export type SubjectCollectionReference = GraphEdge & ISubjectCollectionReference & References & {
  __typename: 'SubjectCollectionReference';
  _id: Scalars['ID'];
  node: User;
};

export type SubjectCollectionReferenceEdge = GraphPageEdge & ISubjectCollectionReference & References & {
  __typename: 'SubjectCollectionReferenceEdge';
  _id: Scalars['ID'];
  cursor: Scalars['String'];
  node: User;
};

export type SubjectCollectionReferencesPage = Page & {
  __typename: 'SubjectCollectionReferencesPage';
  pageInfo: PageInfo;
  edges: Array<SubjectCollectionReferenceEdge>;
};

export type ISubjectResourceReference = {
  node: User;
};

export type SubjectResourceReference = GraphEdge & ISubjectResourceReference & References & {
  __typename: 'SubjectResourceReference';
  _id: Scalars['ID'];
  node: User;
};

export type SubjectResourceReferenceEdge = GraphPageEdge & ISubjectResourceReference & References & {
  __typename: 'SubjectResourceReferenceEdge';
  _id: Scalars['ID'];
  cursor: Scalars['String'];
  node: User;
};

export type SubjectResourceReferencesPage = Page & {
  __typename: 'SubjectResourceReferencesPage';
  pageInfo: PageInfo;
  edges: Array<SubjectResourceReferenceEdge>;
};

export type CreateResourceInput = {
  name: Scalars['String'];
};

export type CreateSubjectInput = {
  name: Scalars['String'];
};

export type SessionAccount = {
  __typename: 'SessionAccount';
  username: Scalars['String'];
  user: User;
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
  GraphVertex: ResolversTypes['Collection'] | ResolversTypes['Resource'] | ResolversTypes['Subject'] | ResolversTypes['User'];
  ID: ResolverTypeWrapper<Scalars['ID']>;
  GraphEdge: ResolversTypes['CollectionContainsResource'] | ResolversTypes['ResourceContainer'] | ResolversTypes['CollectionFollower'] | ResolversTypes['SubjectFollower'] | ResolversTypes['UserFollower'] | ResolversTypes['UserFollowsCollection'] | ResolversTypes['UserFollowsSubject'] | ResolversTypes['UserFollowsUser'] | ResolversTypes['ResourceLiker'] | ResolversTypes['UserLikesResource'] | ResolversTypes['CollectionReferencesSubject'] | ResolversTypes['ResourceReferencesSubject'] | ResolversTypes['SubjectCollectionReference'] | ResolversTypes['SubjectResourceReference'];
  GraphPageEdge: ResolversTypes['CollectionContainsResourceEdge'] | ResolversTypes['ResourceContainerEdge'] | ResolversTypes['CollectionFollowerEdge'] | ResolversTypes['SubjectFollowerEdge'] | ResolversTypes['UserFollowerEdge'] | ResolversTypes['UserFollowsCollectionEdge'] | ResolversTypes['UserFollowsSubjectEdge'] | ResolversTypes['UserFollowsUserEdge'] | ResolversTypes['ResourceLikerEdge'] | ResolversTypes['UserLikesResourceEdge'] | ResolversTypes['CollectionReferencesSubjectEdge'] | ResolversTypes['ResourceReferencesSubjectEdge'] | ResolversTypes['SubjectCollectionReferenceEdge'] | ResolversTypes['SubjectResourceReferenceEdge'];
  String: ResolverTypeWrapper<Scalars['String']>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Page: ResolversTypes['CollectionContainsResourcePage'] | ResolversTypes['ResourceContainersPage'] | ResolversTypes['CollectionFollowersPage'] | ResolversTypes['SubjectFollowersPage'] | ResolversTypes['UserFollowerPage'] | ResolversTypes['UserFollowsCollectionPage'] | ResolversTypes['UserFollowsSubjectPage'] | ResolversTypes['UserFollowsUserPage'] | ResolversTypes['ResourceLikersPage'] | ResolversTypes['UserLikesResourcePage'] | ResolversTypes['CollectionReferencesSubjectPage'] | ResolversTypes['ResourceReferencesSubjectPage'] | ResolversTypes['SubjectCollectionReferencesPage'] | ResolversTypes['SubjectResourceReferencesPage'];
  PageInput: PageInput;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Collection: ResolverTypeWrapper<Collection>;
  Query: ResolverTypeWrapper<RootValue>;
  CreateCollectionInput: CreateCollectionInput;
  Mutation: ResolverTypeWrapper<RootValue>;
  ICollectionContainsResource: ResolversTypes['CollectionContainsResource'] | ResolversTypes['CollectionContainsResourceEdge'];
  CollectionContainsResource: ResolverTypeWrapper<CollectionContainsResource>;
  CollectionContainsResourceEdge: ResolverTypeWrapper<CollectionContainsResourceEdge>;
  CollectionContainsResourcePage: ResolverTypeWrapper<CollectionContainsResourcePage>;
  Contains: ResolversTypes['CollectionContainsResource'] | ResolversTypes['CollectionContainsResourceEdge'] | ResolversTypes['ResourceContainer'] | ResolversTypes['ResourceContainerEdge'];
  IResourceContainer: ResolversTypes['ResourceContainer'] | ResolversTypes['ResourceContainerEdge'];
  ResourceContainer: ResolverTypeWrapper<ResourceContainer>;
  ResourceContainerEdge: ResolverTypeWrapper<ResourceContainerEdge>;
  ResourceContainersPage: ResolverTypeWrapper<ResourceContainersPage>;
  Resource: ResolverTypeWrapper<Resource>;
  ICollectionFollower: ResolversTypes['CollectionFollower'] | ResolversTypes['CollectionFollowerEdge'];
  CollectionFollower: ResolverTypeWrapper<CollectionFollower>;
  CollectionFollowerEdge: ResolverTypeWrapper<CollectionFollowerEdge>;
  CollectionFollowersPage: ResolverTypeWrapper<CollectionFollowersPage>;
  Follows: ResolversTypes['CollectionFollower'] | ResolversTypes['CollectionFollowerEdge'] | ResolversTypes['SubjectFollower'] | ResolversTypes['SubjectFollowerEdge'] | ResolversTypes['UserFollower'] | ResolversTypes['UserFollowerEdge'] | ResolversTypes['UserFollowsCollection'] | ResolversTypes['UserFollowsCollectionEdge'] | ResolversTypes['UserFollowsSubject'] | ResolversTypes['UserFollowsSubjectEdge'] | ResolversTypes['UserFollowsUser'] | ResolversTypes['UserFollowsUserEdge'];
  ISubjectFollower: ResolversTypes['SubjectFollower'] | ResolversTypes['SubjectFollowerEdge'];
  SubjectFollower: ResolverTypeWrapper<SubjectFollower>;
  SubjectFollowerEdge: ResolverTypeWrapper<SubjectFollowerEdge>;
  SubjectFollowersPage: ResolverTypeWrapper<SubjectFollowersPage>;
  Subject: ResolverTypeWrapper<Subject>;
  IUserFollower: ResolversTypes['UserFollower'] | ResolversTypes['UserFollowerEdge'];
  UserFollower: ResolverTypeWrapper<UserFollower>;
  UserFollowerEdge: ResolverTypeWrapper<UserFollowerEdge>;
  UserFollowerPage: ResolverTypeWrapper<UserFollowerPage>;
  User: ResolverTypeWrapper<User>;
  IUserFollowsCollection: ResolversTypes['UserFollowsCollection'] | ResolversTypes['UserFollowsCollectionEdge'];
  UserFollowsCollection: ResolverTypeWrapper<UserFollowsCollection>;
  UserFollowsCollectionEdge: ResolverTypeWrapper<UserFollowsCollectionEdge>;
  UserFollowsCollectionPage: ResolverTypeWrapper<UserFollowsCollectionPage>;
  IUserFollowsSubject: ResolversTypes['UserFollowsSubject'] | ResolversTypes['UserFollowsSubjectEdge'];
  UserFollowsSubject: ResolverTypeWrapper<UserFollowsSubject>;
  UserFollowsSubjectEdge: ResolverTypeWrapper<UserFollowsSubjectEdge>;
  UserFollowsSubjectPage: ResolverTypeWrapper<UserFollowsSubjectPage>;
  IUserFollowsUser: ResolversTypes['UserFollowsUser'] | ResolversTypes['UserFollowsUserEdge'];
  UserFollowsUser: ResolverTypeWrapper<UserFollowsUser>;
  UserFollowsUserEdge: ResolverTypeWrapper<UserFollowsUserEdge>;
  UserFollowsUserPage: ResolverTypeWrapper<UserFollowsUserPage>;
  Likes: ResolversTypes['ResourceLiker'] | ResolversTypes['ResourceLikerEdge'] | ResolversTypes['UserLikesResource'] | ResolversTypes['UserLikesResourceEdge'];
  IResourceLiker: ResolversTypes['ResourceLiker'] | ResolversTypes['ResourceLikerEdge'];
  ResourceLiker: ResolverTypeWrapper<ResourceLiker>;
  ResourceLikerEdge: ResolverTypeWrapper<ResourceLikerEdge>;
  ResourceLikersPage: ResolverTypeWrapper<ResourceLikersPage>;
  IUserLikesResource: ResolversTypes['UserLikesResource'] | ResolversTypes['UserLikesResourceEdge'];
  UserLikesResource: ResolverTypeWrapper<UserLikesResource>;
  UserLikesResourceEdge: ResolverTypeWrapper<UserLikesResourceEdge>;
  UserLikesResourcePage: ResolverTypeWrapper<UserLikesResourcePage>;
  ICollectionReferencesSubject: ResolversTypes['CollectionReferencesSubject'] | ResolversTypes['CollectionReferencesSubjectEdge'];
  CollectionReferencesSubject: ResolverTypeWrapper<CollectionReferencesSubject>;
  CollectionReferencesSubjectEdge: ResolverTypeWrapper<CollectionReferencesSubjectEdge>;
  CollectionReferencesSubjectPage: ResolverTypeWrapper<CollectionReferencesSubjectPage>;
  References: ResolversTypes['CollectionReferencesSubject'] | ResolversTypes['CollectionReferencesSubjectEdge'] | ResolversTypes['ResourceReferencesSubject'] | ResolversTypes['ResourceReferencesSubjectEdge'] | ResolversTypes['SubjectCollectionReference'] | ResolversTypes['SubjectCollectionReferenceEdge'] | ResolversTypes['SubjectResourceReference'] | ResolversTypes['SubjectResourceReferenceEdge'];
  IResourceReferencesSubject: ResolversTypes['ResourceReferencesSubject'] | ResolversTypes['ResourceReferencesSubjectEdge'];
  ResourceReferencesSubject: ResolverTypeWrapper<ResourceReferencesSubject>;
  ResourceReferencesSubjectEdge: ResolverTypeWrapper<ResourceReferencesSubjectEdge>;
  ResourceReferencesSubjectPage: ResolverTypeWrapper<ResourceReferencesSubjectPage>;
  ISubjectCollectionReference: ResolversTypes['SubjectCollectionReference'] | ResolversTypes['SubjectCollectionReferenceEdge'];
  SubjectCollectionReference: ResolverTypeWrapper<SubjectCollectionReference>;
  SubjectCollectionReferenceEdge: ResolverTypeWrapper<SubjectCollectionReferenceEdge>;
  SubjectCollectionReferencesPage: ResolverTypeWrapper<SubjectCollectionReferencesPage>;
  ISubjectResourceReference: ResolversTypes['SubjectResourceReference'] | ResolversTypes['SubjectResourceReferenceEdge'];
  SubjectResourceReference: ResolverTypeWrapper<SubjectResourceReference>;
  SubjectResourceReferenceEdge: ResolverTypeWrapper<SubjectResourceReferenceEdge>;
  SubjectResourceReferencesPage: ResolverTypeWrapper<SubjectResourceReferencesPage>;
  CreateResourceInput: CreateResourceInput;
  CreateSubjectInput: CreateSubjectInput;
  SessionAccount: ResolverTypeWrapper<SessionAccount>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  GraphVertex: ResolversParentTypes['Collection'] | ResolversParentTypes['Resource'] | ResolversParentTypes['Subject'] | ResolversParentTypes['User'];
  ID: Scalars['ID'];
  GraphEdge: ResolversParentTypes['CollectionContainsResource'] | ResolversParentTypes['ResourceContainer'] | ResolversParentTypes['CollectionFollower'] | ResolversParentTypes['SubjectFollower'] | ResolversParentTypes['UserFollower'] | ResolversParentTypes['UserFollowsCollection'] | ResolversParentTypes['UserFollowsSubject'] | ResolversParentTypes['UserFollowsUser'] | ResolversParentTypes['ResourceLiker'] | ResolversParentTypes['UserLikesResource'] | ResolversParentTypes['CollectionReferencesSubject'] | ResolversParentTypes['ResourceReferencesSubject'] | ResolversParentTypes['SubjectCollectionReference'] | ResolversParentTypes['SubjectResourceReference'];
  GraphPageEdge: ResolversParentTypes['CollectionContainsResourceEdge'] | ResolversParentTypes['ResourceContainerEdge'] | ResolversParentTypes['CollectionFollowerEdge'] | ResolversParentTypes['SubjectFollowerEdge'] | ResolversParentTypes['UserFollowerEdge'] | ResolversParentTypes['UserFollowsCollectionEdge'] | ResolversParentTypes['UserFollowsSubjectEdge'] | ResolversParentTypes['UserFollowsUserEdge'] | ResolversParentTypes['ResourceLikerEdge'] | ResolversParentTypes['UserLikesResourceEdge'] | ResolversParentTypes['CollectionReferencesSubjectEdge'] | ResolversParentTypes['ResourceReferencesSubjectEdge'] | ResolversParentTypes['SubjectCollectionReferenceEdge'] | ResolversParentTypes['SubjectResourceReferenceEdge'];
  String: Scalars['String'];
  PageInfo: PageInfo;
  Boolean: Scalars['Boolean'];
  Page: ResolversParentTypes['CollectionContainsResourcePage'] | ResolversParentTypes['ResourceContainersPage'] | ResolversParentTypes['CollectionFollowersPage'] | ResolversParentTypes['SubjectFollowersPage'] | ResolversParentTypes['UserFollowerPage'] | ResolversParentTypes['UserFollowsCollectionPage'] | ResolversParentTypes['UserFollowsSubjectPage'] | ResolversParentTypes['UserFollowsUserPage'] | ResolversParentTypes['ResourceLikersPage'] | ResolversParentTypes['UserLikesResourcePage'] | ResolversParentTypes['CollectionReferencesSubjectPage'] | ResolversParentTypes['ResourceReferencesSubjectPage'] | ResolversParentTypes['SubjectCollectionReferencesPage'] | ResolversParentTypes['SubjectResourceReferencesPage'];
  PageInput: PageInput;
  Int: Scalars['Int'];
  Collection: Collection;
  Query: RootValue;
  CreateCollectionInput: CreateCollectionInput;
  Mutation: RootValue;
  ICollectionContainsResource: ResolversParentTypes['CollectionContainsResource'] | ResolversParentTypes['CollectionContainsResourceEdge'];
  CollectionContainsResource: CollectionContainsResource;
  CollectionContainsResourceEdge: CollectionContainsResourceEdge;
  CollectionContainsResourcePage: CollectionContainsResourcePage;
  Contains: ResolversParentTypes['CollectionContainsResource'] | ResolversParentTypes['CollectionContainsResourceEdge'] | ResolversParentTypes['ResourceContainer'] | ResolversParentTypes['ResourceContainerEdge'];
  IResourceContainer: ResolversParentTypes['ResourceContainer'] | ResolversParentTypes['ResourceContainerEdge'];
  ResourceContainer: ResourceContainer;
  ResourceContainerEdge: ResourceContainerEdge;
  ResourceContainersPage: ResourceContainersPage;
  Resource: Resource;
  ICollectionFollower: ResolversParentTypes['CollectionFollower'] | ResolversParentTypes['CollectionFollowerEdge'];
  CollectionFollower: CollectionFollower;
  CollectionFollowerEdge: CollectionFollowerEdge;
  CollectionFollowersPage: CollectionFollowersPage;
  Follows: ResolversParentTypes['CollectionFollower'] | ResolversParentTypes['CollectionFollowerEdge'] | ResolversParentTypes['SubjectFollower'] | ResolversParentTypes['SubjectFollowerEdge'] | ResolversParentTypes['UserFollower'] | ResolversParentTypes['UserFollowerEdge'] | ResolversParentTypes['UserFollowsCollection'] | ResolversParentTypes['UserFollowsCollectionEdge'] | ResolversParentTypes['UserFollowsSubject'] | ResolversParentTypes['UserFollowsSubjectEdge'] | ResolversParentTypes['UserFollowsUser'] | ResolversParentTypes['UserFollowsUserEdge'];
  ISubjectFollower: ResolversParentTypes['SubjectFollower'] | ResolversParentTypes['SubjectFollowerEdge'];
  SubjectFollower: SubjectFollower;
  SubjectFollowerEdge: SubjectFollowerEdge;
  SubjectFollowersPage: SubjectFollowersPage;
  Subject: Subject;
  IUserFollower: ResolversParentTypes['UserFollower'] | ResolversParentTypes['UserFollowerEdge'];
  UserFollower: UserFollower;
  UserFollowerEdge: UserFollowerEdge;
  UserFollowerPage: UserFollowerPage;
  User: User;
  IUserFollowsCollection: ResolversParentTypes['UserFollowsCollection'] | ResolversParentTypes['UserFollowsCollectionEdge'];
  UserFollowsCollection: UserFollowsCollection;
  UserFollowsCollectionEdge: UserFollowsCollectionEdge;
  UserFollowsCollectionPage: UserFollowsCollectionPage;
  IUserFollowsSubject: ResolversParentTypes['UserFollowsSubject'] | ResolversParentTypes['UserFollowsSubjectEdge'];
  UserFollowsSubject: UserFollowsSubject;
  UserFollowsSubjectEdge: UserFollowsSubjectEdge;
  UserFollowsSubjectPage: UserFollowsSubjectPage;
  IUserFollowsUser: ResolversParentTypes['UserFollowsUser'] | ResolversParentTypes['UserFollowsUserEdge'];
  UserFollowsUser: UserFollowsUser;
  UserFollowsUserEdge: UserFollowsUserEdge;
  UserFollowsUserPage: UserFollowsUserPage;
  Likes: ResolversParentTypes['ResourceLiker'] | ResolversParentTypes['ResourceLikerEdge'] | ResolversParentTypes['UserLikesResource'] | ResolversParentTypes['UserLikesResourceEdge'];
  IResourceLiker: ResolversParentTypes['ResourceLiker'] | ResolversParentTypes['ResourceLikerEdge'];
  ResourceLiker: ResourceLiker;
  ResourceLikerEdge: ResourceLikerEdge;
  ResourceLikersPage: ResourceLikersPage;
  IUserLikesResource: ResolversParentTypes['UserLikesResource'] | ResolversParentTypes['UserLikesResourceEdge'];
  UserLikesResource: UserLikesResource;
  UserLikesResourceEdge: UserLikesResourceEdge;
  UserLikesResourcePage: UserLikesResourcePage;
  ICollectionReferencesSubject: ResolversParentTypes['CollectionReferencesSubject'] | ResolversParentTypes['CollectionReferencesSubjectEdge'];
  CollectionReferencesSubject: CollectionReferencesSubject;
  CollectionReferencesSubjectEdge: CollectionReferencesSubjectEdge;
  CollectionReferencesSubjectPage: CollectionReferencesSubjectPage;
  References: ResolversParentTypes['CollectionReferencesSubject'] | ResolversParentTypes['CollectionReferencesSubjectEdge'] | ResolversParentTypes['ResourceReferencesSubject'] | ResolversParentTypes['ResourceReferencesSubjectEdge'] | ResolversParentTypes['SubjectCollectionReference'] | ResolversParentTypes['SubjectCollectionReferenceEdge'] | ResolversParentTypes['SubjectResourceReference'] | ResolversParentTypes['SubjectResourceReferenceEdge'];
  IResourceReferencesSubject: ResolversParentTypes['ResourceReferencesSubject'] | ResolversParentTypes['ResourceReferencesSubjectEdge'];
  ResourceReferencesSubject: ResourceReferencesSubject;
  ResourceReferencesSubjectEdge: ResourceReferencesSubjectEdge;
  ResourceReferencesSubjectPage: ResourceReferencesSubjectPage;
  ISubjectCollectionReference: ResolversParentTypes['SubjectCollectionReference'] | ResolversParentTypes['SubjectCollectionReferenceEdge'];
  SubjectCollectionReference: SubjectCollectionReference;
  SubjectCollectionReferenceEdge: SubjectCollectionReferenceEdge;
  SubjectCollectionReferencesPage: SubjectCollectionReferencesPage;
  ISubjectResourceReference: ResolversParentTypes['SubjectResourceReference'] | ResolversParentTypes['SubjectResourceReferenceEdge'];
  SubjectResourceReference: SubjectResourceReference;
  SubjectResourceReferenceEdge: SubjectResourceReferenceEdge;
  SubjectResourceReferencesPage: SubjectResourceReferencesPage;
  CreateResourceInput: CreateResourceInput;
  CreateSubjectInput: CreateSubjectInput;
  SessionAccount: SessionAccount;
};

export type AccessDirectiveArgs = {   level: Array<AccessLevel>; };

export type AccessDirectiveResolver<Result, Parent, ContextType = Context, Args = AccessDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type GraphVertexResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GraphVertex'] = ResolversParentTypes['GraphVertex']> = {
  __resolveType: TypeResolveFn<'Collection' | 'Resource' | 'Subject' | 'User', ParentType, ContextType>;
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type GraphEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GraphEdge'] = ResolversParentTypes['GraphEdge']> = {
  __resolveType: TypeResolveFn<'CollectionContainsResource' | 'ResourceContainer' | 'CollectionFollower' | 'SubjectFollower' | 'UserFollower' | 'UserFollowsCollection' | 'UserFollowsSubject' | 'UserFollowsUser' | 'ResourceLiker' | 'UserLikesResource' | 'CollectionReferencesSubject' | 'ResourceReferencesSubject' | 'SubjectCollectionReference' | 'SubjectResourceReference', ParentType, ContextType>;
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['GraphVertex'], ParentType, ContextType>;
};

export type GraphPageEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GraphPageEdge'] = ResolversParentTypes['GraphPageEdge']> = {
  __resolveType: TypeResolveFn<'CollectionContainsResourceEdge' | 'ResourceContainerEdge' | 'CollectionFollowerEdge' | 'SubjectFollowerEdge' | 'UserFollowerEdge' | 'UserFollowsCollectionEdge' | 'UserFollowsSubjectEdge' | 'UserFollowsUserEdge' | 'ResourceLikerEdge' | 'UserLikesResourceEdge' | 'CollectionReferencesSubjectEdge' | 'ResourceReferencesSubjectEdge' | 'SubjectCollectionReferenceEdge' | 'SubjectResourceReferenceEdge', ParentType, ContextType>;
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
  __resolveType: TypeResolveFn<'CollectionContainsResourcePage' | 'ResourceContainersPage' | 'CollectionFollowersPage' | 'SubjectFollowersPage' | 'UserFollowerPage' | 'UserFollowsCollectionPage' | 'UserFollowsSubjectPage' | 'UserFollowsUserPage' | 'ResourceLikersPage' | 'UserLikesResourcePage' | 'CollectionReferencesSubjectPage' | 'ResourceReferencesSubjectPage' | 'SubjectCollectionReferencesPage' | 'SubjectResourceReferencesPage', ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges: Resolver<Array<ResolversTypes['GraphPageEdge']>, ParentType, ContextType>;
};

export type CollectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Collection'] = ResolversParentTypes['Collection']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  containsResources: Resolver<ResolversTypes['CollectionContainsResourcePage'], ParentType, ContextType, RequireFields<CollectionContainsResourcesArgs, never>>;
  followers: Resolver<ResolversTypes['CollectionFollowersPage'], ParentType, ContextType, RequireFields<CollectionFollowersArgs, never>>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subjectReferences: Resolver<ResolversTypes['CollectionReferencesSubjectPage'], ParentType, ContextType, RequireFields<CollectionSubjectReferencesArgs, never>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  collection: Resolver<Maybe<ResolversTypes['Collection']>, ParentType, ContextType, RequireFields<QueryCollectionArgs, '_id'>>;
  getSessionAccountUser: Resolver<Maybe<ResolversTypes['SessionAccount']>, ParentType, ContextType, RequireFields<QueryGetSessionAccountUserArgs, 'username'>>;
  resource: Resolver<Maybe<ResolversTypes['Resource']>, ParentType, ContextType, RequireFields<QueryResourceArgs, '_id'>>;
  subject: Resolver<Maybe<ResolversTypes['Subject']>, ParentType, ContextType, RequireFields<QuerySubjectArgs, '_id'>>;
  user: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, '_id'>>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  collectionReferencesSubject: Resolver<Maybe<ResolversTypes['CollectionReferencesSubject']>, ParentType, ContextType, RequireFields<MutationCollectionReferencesSubjectArgs, never>>;
  containResource: Resolver<Maybe<ResolversTypes['CollectionContainsResource']>, ParentType, ContextType, RequireFields<MutationContainResourceArgs, never>>;
  createCollection: Resolver<ResolversTypes['Collection'], ParentType, ContextType, RequireFields<MutationCreateCollectionArgs, never>>;
  createResource: Resolver<ResolversTypes['Resource'], ParentType, ContextType, RequireFields<MutationCreateResourceArgs, never>>;
  createSubject: Resolver<Maybe<ResolversTypes['Subject']>, ParentType, ContextType, RequireFields<MutationCreateSubjectArgs, 'subjectInput'>>;
  followCollection: Resolver<Maybe<ResolversTypes['UserFollowsCollection']>, ParentType, ContextType, RequireFields<MutationFollowCollectionArgs, never>>;
  followSubject: Resolver<Maybe<ResolversTypes['UserFollowsSubject']>, ParentType, ContextType, RequireFields<MutationFollowSubjectArgs, never>>;
  likeResource: Resolver<Maybe<ResolversTypes['UserLikesResource']>, ParentType, ContextType, RequireFields<MutationLikeResourceArgs, never>>;
  resourceReferencesSubject: Resolver<Maybe<ResolversTypes['ResourceReferencesSubject']>, ParentType, ContextType, RequireFields<MutationResourceReferencesSubjectArgs, never>>;
};

export type ICollectionContainsResourceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ICollectionContainsResource'] = ResolversParentTypes['ICollectionContainsResource']> = {
  __resolveType: TypeResolveFn<'CollectionContainsResource' | 'CollectionContainsResourceEdge', ParentType, ContextType>;
  node: Resolver<ResolversTypes['Resource'], ParentType, ContextType>;
};

export type CollectionContainsResourceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CollectionContainsResource'] = ResolversParentTypes['CollectionContainsResource']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['Resource'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionContainsResourceEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CollectionContainsResourceEdge'] = ResolversParentTypes['CollectionContainsResourceEdge']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['Resource'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionContainsResourcePageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CollectionContainsResourcePage'] = ResolversParentTypes['CollectionContainsResourcePage']> = {
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges: Resolver<Array<ResolversTypes['CollectionContainsResourceEdge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContainsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Contains'] = ResolversParentTypes['Contains']> = {
  __resolveType: TypeResolveFn<'CollectionContainsResource' | 'CollectionContainsResourceEdge' | 'ResourceContainer' | 'ResourceContainerEdge', ParentType, ContextType>;
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type IResourceContainerResolvers<ContextType = Context, ParentType extends ResolversParentTypes['IResourceContainer'] = ResolversParentTypes['IResourceContainer']> = {
  __resolveType: TypeResolveFn<'ResourceContainer' | 'ResourceContainerEdge', ParentType, ContextType>;
  node: Resolver<ResolversTypes['Collection'], ParentType, ContextType>;
};

export type ResourceContainerResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ResourceContainer'] = ResolversParentTypes['ResourceContainer']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['Collection'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResourceContainerEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ResourceContainerEdge'] = ResolversParentTypes['ResourceContainerEdge']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['Collection'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResourceContainersPageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ResourceContainersPage'] = ResolversParentTypes['ResourceContainersPage']> = {
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges: Resolver<Array<ResolversTypes['ResourceContainerEdge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResourceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Resource'] = ResolversParentTypes['Resource']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  containers: Resolver<ResolversTypes['ResourceContainersPage'], ParentType, ContextType, RequireFields<ResourceContainersArgs, never>>;
  likers: Resolver<ResolversTypes['ResourceLikersPage'], ParentType, ContextType, RequireFields<ResourceLikersArgs, never>>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subjectReferences: Resolver<ResolversTypes['ResourceReferencesSubjectPage'], ParentType, ContextType, RequireFields<ResourceSubjectReferencesArgs, never>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ICollectionFollowerResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ICollectionFollower'] = ResolversParentTypes['ICollectionFollower']> = {
  __resolveType: TypeResolveFn<'CollectionFollower' | 'CollectionFollowerEdge', ParentType, ContextType>;
  node: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type CollectionFollowerResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CollectionFollower'] = ResolversParentTypes['CollectionFollower']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionFollowerEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CollectionFollowerEdge'] = ResolversParentTypes['CollectionFollowerEdge']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionFollowersPageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CollectionFollowersPage'] = ResolversParentTypes['CollectionFollowersPage']> = {
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges: Resolver<Array<ResolversTypes['CollectionFollowerEdge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FollowsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Follows'] = ResolversParentTypes['Follows']> = {
  __resolveType: TypeResolveFn<'CollectionFollower' | 'CollectionFollowerEdge' | 'SubjectFollower' | 'SubjectFollowerEdge' | 'UserFollower' | 'UserFollowerEdge' | 'UserFollowsCollection' | 'UserFollowsCollectionEdge' | 'UserFollowsSubject' | 'UserFollowsSubjectEdge' | 'UserFollowsUser' | 'UserFollowsUserEdge', ParentType, ContextType>;
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type ISubjectFollowerResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ISubjectFollower'] = ResolversParentTypes['ISubjectFollower']> = {
  __resolveType: TypeResolveFn<'SubjectFollower' | 'SubjectFollowerEdge', ParentType, ContextType>;
  node: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type SubjectFollowerResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubjectFollower'] = ResolversParentTypes['SubjectFollower']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubjectFollowerEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubjectFollowerEdge'] = ResolversParentTypes['SubjectFollowerEdge']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubjectFollowersPageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubjectFollowersPage'] = ResolversParentTypes['SubjectFollowersPage']> = {
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges: Resolver<Array<ResolversTypes['SubjectFollowerEdge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subject'] = ResolversParentTypes['Subject']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  collectionReferences: Resolver<ResolversTypes['SubjectCollectionReferencesPage'], ParentType, ContextType, RequireFields<SubjectCollectionReferencesArgs, never>>;
  followers: Resolver<ResolversTypes['SubjectFollowersPage'], ParentType, ContextType, RequireFields<SubjectFollowersArgs, never>>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resourceReferences: Resolver<ResolversTypes['SubjectResourceReferencesPage'], ParentType, ContextType, RequireFields<SubjectResourceReferencesArgs, never>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IUserFollowerResolvers<ContextType = Context, ParentType extends ResolversParentTypes['IUserFollower'] = ResolversParentTypes['IUserFollower']> = {
  __resolveType: TypeResolveFn<'UserFollower' | 'UserFollowerEdge', ParentType, ContextType>;
  node: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type UserFollowerResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserFollower'] = ResolversParentTypes['UserFollower']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserFollowerEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserFollowerEdge'] = ResolversParentTypes['UserFollowerEdge']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserFollowerPageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserFollowerPage'] = ResolversParentTypes['UserFollowerPage']> = {
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges: Resolver<Array<ResolversTypes['UserFollowerEdge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  displayName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  followers: Resolver<ResolversTypes['UserFollowerPage'], ParentType, ContextType, RequireFields<UserFollowersArgs, never>>;
  followsCollections: Resolver<ResolversTypes['UserFollowsCollectionPage'], ParentType, ContextType, RequireFields<UserFollowsCollectionsArgs, never>>;
  followsSubjects: Resolver<ResolversTypes['UserFollowsSubjectPage'], ParentType, ContextType, RequireFields<UserFollowsSubjectsArgs, never>>;
  followsUsers: Resolver<ResolversTypes['UserFollowsUserPage'], ParentType, ContextType, RequireFields<UserFollowsUsersArgs, never>>;
  likesResources: Resolver<ResolversTypes['UserLikesResourcePage'], ParentType, ContextType, RequireFields<UserLikesResourcesArgs, never>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IUserFollowsCollectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['IUserFollowsCollection'] = ResolversParentTypes['IUserFollowsCollection']> = {
  __resolveType: TypeResolveFn<'UserFollowsCollection' | 'UserFollowsCollectionEdge', ParentType, ContextType>;
  node: Resolver<ResolversTypes['Collection'], ParentType, ContextType>;
};

export type UserFollowsCollectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserFollowsCollection'] = ResolversParentTypes['UserFollowsCollection']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['Collection'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserFollowsCollectionEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserFollowsCollectionEdge'] = ResolversParentTypes['UserFollowsCollectionEdge']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['Collection'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserFollowsCollectionPageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserFollowsCollectionPage'] = ResolversParentTypes['UserFollowsCollectionPage']> = {
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges: Resolver<Array<ResolversTypes['UserFollowsCollectionEdge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IUserFollowsSubjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['IUserFollowsSubject'] = ResolversParentTypes['IUserFollowsSubject']> = {
  __resolveType: TypeResolveFn<'UserFollowsSubject' | 'UserFollowsSubjectEdge', ParentType, ContextType>;
  node: Resolver<ResolversTypes['Subject'], ParentType, ContextType>;
};

export type UserFollowsSubjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserFollowsSubject'] = ResolversParentTypes['UserFollowsSubject']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['Subject'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserFollowsSubjectEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserFollowsSubjectEdge'] = ResolversParentTypes['UserFollowsSubjectEdge']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['Subject'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserFollowsSubjectPageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserFollowsSubjectPage'] = ResolversParentTypes['UserFollowsSubjectPage']> = {
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges: Resolver<Array<ResolversTypes['UserFollowsSubjectEdge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IUserFollowsUserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['IUserFollowsUser'] = ResolversParentTypes['IUserFollowsUser']> = {
  __resolveType: TypeResolveFn<'UserFollowsUser' | 'UserFollowsUserEdge', ParentType, ContextType>;
  node: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type UserFollowsUserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserFollowsUser'] = ResolversParentTypes['UserFollowsUser']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserFollowsUserEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserFollowsUserEdge'] = ResolversParentTypes['UserFollowsUserEdge']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserFollowsUserPageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserFollowsUserPage'] = ResolversParentTypes['UserFollowsUserPage']> = {
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges: Resolver<Array<ResolversTypes['UserFollowsUserEdge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LikesResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Likes'] = ResolversParentTypes['Likes']> = {
  __resolveType: TypeResolveFn<'ResourceLiker' | 'ResourceLikerEdge' | 'UserLikesResource' | 'UserLikesResourceEdge', ParentType, ContextType>;
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type IResourceLikerResolvers<ContextType = Context, ParentType extends ResolversParentTypes['IResourceLiker'] = ResolversParentTypes['IResourceLiker']> = {
  __resolveType: TypeResolveFn<'ResourceLiker' | 'ResourceLikerEdge', ParentType, ContextType>;
  node: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type ResourceLikerResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ResourceLiker'] = ResolversParentTypes['ResourceLiker']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResourceLikerEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ResourceLikerEdge'] = ResolversParentTypes['ResourceLikerEdge']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResourceLikersPageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ResourceLikersPage'] = ResolversParentTypes['ResourceLikersPage']> = {
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges: Resolver<Array<ResolversTypes['ResourceLikerEdge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IUserLikesResourceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['IUserLikesResource'] = ResolversParentTypes['IUserLikesResource']> = {
  __resolveType: TypeResolveFn<'UserLikesResource' | 'UserLikesResourceEdge', ParentType, ContextType>;
  node: Resolver<ResolversTypes['Resource'], ParentType, ContextType>;
};

export type UserLikesResourceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserLikesResource'] = ResolversParentTypes['UserLikesResource']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['Resource'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserLikesResourceEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserLikesResourceEdge'] = ResolversParentTypes['UserLikesResourceEdge']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['Resource'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserLikesResourcePageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserLikesResourcePage'] = ResolversParentTypes['UserLikesResourcePage']> = {
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges: Resolver<Array<ResolversTypes['UserLikesResourceEdge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ICollectionReferencesSubjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ICollectionReferencesSubject'] = ResolversParentTypes['ICollectionReferencesSubject']> = {
  __resolveType: TypeResolveFn<'CollectionReferencesSubject' | 'CollectionReferencesSubjectEdge', ParentType, ContextType>;
  node: Resolver<ResolversTypes['Subject'], ParentType, ContextType>;
};

export type CollectionReferencesSubjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CollectionReferencesSubject'] = ResolversParentTypes['CollectionReferencesSubject']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['Subject'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionReferencesSubjectEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CollectionReferencesSubjectEdge'] = ResolversParentTypes['CollectionReferencesSubjectEdge']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['Subject'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionReferencesSubjectPageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CollectionReferencesSubjectPage'] = ResolversParentTypes['CollectionReferencesSubjectPage']> = {
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges: Resolver<Array<ResolversTypes['CollectionReferencesSubjectEdge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReferencesResolvers<ContextType = Context, ParentType extends ResolversParentTypes['References'] = ResolversParentTypes['References']> = {
  __resolveType: TypeResolveFn<'CollectionReferencesSubject' | 'CollectionReferencesSubjectEdge' | 'ResourceReferencesSubject' | 'ResourceReferencesSubjectEdge' | 'SubjectCollectionReference' | 'SubjectCollectionReferenceEdge' | 'SubjectResourceReference' | 'SubjectResourceReferenceEdge', ParentType, ContextType>;
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type IResourceReferencesSubjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['IResourceReferencesSubject'] = ResolversParentTypes['IResourceReferencesSubject']> = {
  __resolveType: TypeResolveFn<'ResourceReferencesSubject' | 'ResourceReferencesSubjectEdge', ParentType, ContextType>;
  node: Resolver<ResolversTypes['Subject'], ParentType, ContextType>;
};

export type ResourceReferencesSubjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ResourceReferencesSubject'] = ResolversParentTypes['ResourceReferencesSubject']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['Subject'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResourceReferencesSubjectEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ResourceReferencesSubjectEdge'] = ResolversParentTypes['ResourceReferencesSubjectEdge']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['Subject'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResourceReferencesSubjectPageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ResourceReferencesSubjectPage'] = ResolversParentTypes['ResourceReferencesSubjectPage']> = {
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges: Resolver<Array<ResolversTypes['ResourceReferencesSubjectEdge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ISubjectCollectionReferenceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ISubjectCollectionReference'] = ResolversParentTypes['ISubjectCollectionReference']> = {
  __resolveType: TypeResolveFn<'SubjectCollectionReference' | 'SubjectCollectionReferenceEdge', ParentType, ContextType>;
  node: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type SubjectCollectionReferenceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubjectCollectionReference'] = ResolversParentTypes['SubjectCollectionReference']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubjectCollectionReferenceEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubjectCollectionReferenceEdge'] = ResolversParentTypes['SubjectCollectionReferenceEdge']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubjectCollectionReferencesPageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubjectCollectionReferencesPage'] = ResolversParentTypes['SubjectCollectionReferencesPage']> = {
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges: Resolver<Array<ResolversTypes['SubjectCollectionReferenceEdge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ISubjectResourceReferenceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ISubjectResourceReference'] = ResolversParentTypes['ISubjectResourceReference']> = {
  __resolveType: TypeResolveFn<'SubjectResourceReference' | 'SubjectResourceReferenceEdge', ParentType, ContextType>;
  node: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type SubjectResourceReferenceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubjectResourceReference'] = ResolversParentTypes['SubjectResourceReference']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubjectResourceReferenceEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubjectResourceReferenceEdge'] = ResolversParentTypes['SubjectResourceReferenceEdge']> = {
  _id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubjectResourceReferencesPageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubjectResourceReferencesPage'] = ResolversParentTypes['SubjectResourceReferencesPage']> = {
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  edges: Resolver<Array<ResolversTypes['SubjectResourceReferenceEdge']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SessionAccountResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SessionAccount'] = ResolversParentTypes['SessionAccount']> = {
  username: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  GraphVertex: GraphVertexResolvers<ContextType>;
  GraphEdge: GraphEdgeResolvers<ContextType>;
  GraphPageEdge: GraphPageEdgeResolvers<ContextType>;
  PageInfo: PageInfoResolvers<ContextType>;
  Page: PageResolvers<ContextType>;
  Collection: CollectionResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  ICollectionContainsResource: ICollectionContainsResourceResolvers<ContextType>;
  CollectionContainsResource: CollectionContainsResourceResolvers<ContextType>;
  CollectionContainsResourceEdge: CollectionContainsResourceEdgeResolvers<ContextType>;
  CollectionContainsResourcePage: CollectionContainsResourcePageResolvers<ContextType>;
  Contains: ContainsResolvers<ContextType>;
  IResourceContainer: IResourceContainerResolvers<ContextType>;
  ResourceContainer: ResourceContainerResolvers<ContextType>;
  ResourceContainerEdge: ResourceContainerEdgeResolvers<ContextType>;
  ResourceContainersPage: ResourceContainersPageResolvers<ContextType>;
  Resource: ResourceResolvers<ContextType>;
  ICollectionFollower: ICollectionFollowerResolvers<ContextType>;
  CollectionFollower: CollectionFollowerResolvers<ContextType>;
  CollectionFollowerEdge: CollectionFollowerEdgeResolvers<ContextType>;
  CollectionFollowersPage: CollectionFollowersPageResolvers<ContextType>;
  Follows: FollowsResolvers<ContextType>;
  ISubjectFollower: ISubjectFollowerResolvers<ContextType>;
  SubjectFollower: SubjectFollowerResolvers<ContextType>;
  SubjectFollowerEdge: SubjectFollowerEdgeResolvers<ContextType>;
  SubjectFollowersPage: SubjectFollowersPageResolvers<ContextType>;
  Subject: SubjectResolvers<ContextType>;
  IUserFollower: IUserFollowerResolvers<ContextType>;
  UserFollower: UserFollowerResolvers<ContextType>;
  UserFollowerEdge: UserFollowerEdgeResolvers<ContextType>;
  UserFollowerPage: UserFollowerPageResolvers<ContextType>;
  User: UserResolvers<ContextType>;
  IUserFollowsCollection: IUserFollowsCollectionResolvers<ContextType>;
  UserFollowsCollection: UserFollowsCollectionResolvers<ContextType>;
  UserFollowsCollectionEdge: UserFollowsCollectionEdgeResolvers<ContextType>;
  UserFollowsCollectionPage: UserFollowsCollectionPageResolvers<ContextType>;
  IUserFollowsSubject: IUserFollowsSubjectResolvers<ContextType>;
  UserFollowsSubject: UserFollowsSubjectResolvers<ContextType>;
  UserFollowsSubjectEdge: UserFollowsSubjectEdgeResolvers<ContextType>;
  UserFollowsSubjectPage: UserFollowsSubjectPageResolvers<ContextType>;
  IUserFollowsUser: IUserFollowsUserResolvers<ContextType>;
  UserFollowsUser: UserFollowsUserResolvers<ContextType>;
  UserFollowsUserEdge: UserFollowsUserEdgeResolvers<ContextType>;
  UserFollowsUserPage: UserFollowsUserPageResolvers<ContextType>;
  Likes: LikesResolvers<ContextType>;
  IResourceLiker: IResourceLikerResolvers<ContextType>;
  ResourceLiker: ResourceLikerResolvers<ContextType>;
  ResourceLikerEdge: ResourceLikerEdgeResolvers<ContextType>;
  ResourceLikersPage: ResourceLikersPageResolvers<ContextType>;
  IUserLikesResource: IUserLikesResourceResolvers<ContextType>;
  UserLikesResource: UserLikesResourceResolvers<ContextType>;
  UserLikesResourceEdge: UserLikesResourceEdgeResolvers<ContextType>;
  UserLikesResourcePage: UserLikesResourcePageResolvers<ContextType>;
  ICollectionReferencesSubject: ICollectionReferencesSubjectResolvers<ContextType>;
  CollectionReferencesSubject: CollectionReferencesSubjectResolvers<ContextType>;
  CollectionReferencesSubjectEdge: CollectionReferencesSubjectEdgeResolvers<ContextType>;
  CollectionReferencesSubjectPage: CollectionReferencesSubjectPageResolvers<ContextType>;
  References: ReferencesResolvers<ContextType>;
  IResourceReferencesSubject: IResourceReferencesSubjectResolvers<ContextType>;
  ResourceReferencesSubject: ResourceReferencesSubjectResolvers<ContextType>;
  ResourceReferencesSubjectEdge: ResourceReferencesSubjectEdgeResolvers<ContextType>;
  ResourceReferencesSubjectPage: ResourceReferencesSubjectPageResolvers<ContextType>;
  ISubjectCollectionReference: ISubjectCollectionReferenceResolvers<ContextType>;
  SubjectCollectionReference: SubjectCollectionReferenceResolvers<ContextType>;
  SubjectCollectionReferenceEdge: SubjectCollectionReferenceEdgeResolvers<ContextType>;
  SubjectCollectionReferencesPage: SubjectCollectionReferencesPageResolvers<ContextType>;
  ISubjectResourceReference: ISubjectResourceReferenceResolvers<ContextType>;
  SubjectResourceReference: SubjectResourceReferenceResolvers<ContextType>;
  SubjectResourceReferenceEdge: SubjectResourceReferenceEdgeResolvers<ContextType>;
  SubjectResourceReferencesPage: SubjectResourceReferencesPageResolvers<ContextType>;
  SessionAccount: SessionAccountResolvers<ContextType>;
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