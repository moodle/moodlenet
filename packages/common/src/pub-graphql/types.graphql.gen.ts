import { Id } from './types';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: Id;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Never: never;
  Empty: {};
  DateTime: Date;
  Cursor: string;
};




export type CtxAssertion =
  | 'ExecutorIsAuthenticated'
  | 'ExecutorIsSystem'
  | 'ExecutorIsAdmin'
  | 'ExecutorIsAnonymous';

export type NodeAssertion =
  | 'ExecutorCreatedThisNode'
  | 'ThisNodeIsExecutorProfile';

export type ConnAssertion =
  | 'NoExistingSameEdgeTypeInSameDirectionBetweenTheSameTwoNodes'
  | 'NoExistingSameEdgeTypeToThisNode';

export type Mutation = {
  __typename: 'Mutation';
  activateUser: CreateSession;
  changeEmailConfirm: Scalars['Boolean'];
  changeEmailRequest: SimpleResponse;
  changePassword: SimpleResponse;
  createEdge: CreateEdgeMutationPayload;
  createNode: CreateNodeMutationPayload;
  createSession: CreateSession;
  deleteEdge: DeleteEdgeMutationPayload;
  deleteNode: DeleteNodeMutationPayload;
  sessionByEmail: SimpleResponse;
  signUp: SimpleResponse;
  updateEdge: UpdateEdgeMutationPayload;
  updateNode: UpdateNodeMutationPayload;
};


export type MutationActivateUserArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
  token: Scalars['String'];
};


export type MutationChangeEmailConfirmArgs = {
  token: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationChangeEmailRequestArgs = {
  newEmail: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  currentPassword: Scalars['String'];
};


export type MutationCreateEdgeArgs = {
  input: CreateEdgeInput;
};


export type MutationCreateNodeArgs = {
  input: CreateNodeInput;
};


export type MutationCreateSessionArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
};


export type MutationDeleteEdgeArgs = {
  input: DeleteEdgeInput;
};


export type MutationDeleteNodeArgs = {
  input: DeleteNodeInput;
};


export type MutationSessionByEmailArgs = {
  username: Scalars['String'];
  email: Scalars['String'];
};


export type MutationSignUpArgs = {
  email: Scalars['String'];
};


export type MutationUpdateEdgeArgs = {
  input: UpdateEdgeInput;
};


export type MutationUpdateNodeArgs = {
  input: UpdateNodeInput;
};

export type CreateNodeInput = {
  Collection?: Maybe<CreateCollectionInput>;
  Profile?: Maybe<CreateProfileInput>;
  Resource?: Maybe<CreateResourceInput>;
  Subject?: Maybe<CreateSubjectInput>;
  nodeType: NodeType;
};

export type CreateNodeMutationPayload = CreateNodeMutationSuccess | CreateNodeMutationError;

export type CreateNodeMutationSuccess = {
  __typename: 'CreateNodeMutationSuccess';
  node: Node;
};

export type CreateNodeMutationError = {
  __typename: 'CreateNodeMutationError';
  type: CreateNodeMutationErrorType;
  details?: Maybe<Scalars['String']>;
};

export type CreateNodeMutationErrorType =
  | 'NotAuthorized'
  | 'UnexpectedInput'
  | 'AssertionFailed';

export type CreateEdgeInput = {
  AppliesTo?: Maybe<Scalars['Empty']>;
  Contains?: Maybe<Scalars['Empty']>;
  Created?: Maybe<Scalars['Empty']>;
  Follows?: Maybe<Scalars['Empty']>;
  Likes?: Maybe<Scalars['Empty']>;
  edgeType: EdgeType;
  from: Scalars['ID'];
  to: Scalars['ID'];
};

export type CreateEdgeMutationPayload = CreateEdgeMutationSuccess | CreateEdgeMutationError;

export type CreateEdgeMutationSuccess = {
  __typename: 'CreateEdgeMutationSuccess';
  edge: Edge;
};

export type CreateEdgeMutationError = {
  __typename: 'CreateEdgeMutationError';
  type: CreateEdgeMutationErrorType;
  details?: Maybe<Scalars['String']>;
};

export type CreateEdgeMutationErrorType =
  | 'NotAuthorized'
  | 'NotAllowed'
  | 'AssertionFailed'
  | 'NoSelfReference'
  | 'UnexpectedInput';

export type UpdateNodeInput = {
  Collection?: Maybe<UpdateCollectionInput>;
  Profile?: Maybe<UpdateProfileInput>;
  Resource?: Maybe<UpdateResourceInput>;
  Subject?: Maybe<UpdateSubjectInput>;
  id: Scalars['ID'];
  nodeType: NodeType;
};

export type UpdateNodeMutationPayload = UpdateNodeMutationSuccess | UpdateNodeMutationError;

export type UpdateNodeMutationSuccess = {
  __typename: 'UpdateNodeMutationSuccess';
  node?: Maybe<Node>;
};

export type UpdateNodeMutationError = {
  __typename: 'UpdateNodeMutationError';
  type: UpdateNodeMutationErrorType;
  details?: Maybe<Scalars['String']>;
};

export type UpdateNodeMutationErrorType =
  | 'NotFound'
  | 'NotAuthorized'
  | 'UnexpectedInput'
  | 'AssertionFailed';

export type UpdateEdgeInput = {
  AppliesTo?: Maybe<Scalars['Empty']>;
  Contains?: Maybe<Scalars['Empty']>;
  Created?: Maybe<Scalars['Empty']>;
  Follows?: Maybe<Scalars['Empty']>;
  Likes?: Maybe<Scalars['Empty']>;
  edgeType: EdgeType;
  id: Scalars['ID'];
};

export type UpdateEdgeMutationPayload = UpdateEdgeMutationSuccess | UpdateEdgeMutationError;

export type UpdateEdgeMutationSuccess = {
  __typename: 'UpdateEdgeMutationSuccess';
  edge?: Maybe<Edge>;
};

export type UpdateEdgeMutationError = {
  __typename: 'UpdateEdgeMutationError';
  type: UpdateEdgeMutationErrorType;
  details?: Maybe<Scalars['String']>;
};

export type UpdateEdgeMutationErrorType =
  | 'NotFound'
  | 'NotAuthorized'
  | 'UnexpectedInput'
  | 'AssertionFailed';

export type DeleteEdgeInput = {
  id: Scalars['ID'];
  edgeType: EdgeType;
};

export type DeleteEdgeMutationPayload = DeleteEdgeMutationSuccess | DeleteEdgeMutationError;

export type DeleteEdgeMutationSuccess = {
  __typename: 'DeleteEdgeMutationSuccess';
  edgeId?: Maybe<Scalars['ID']>;
};

export type DeleteEdgeMutationError = {
  __typename: 'DeleteEdgeMutationError';
  type?: Maybe<DeleteEdgeMutationErrorType>;
  details?: Maybe<Scalars['String']>;
};

export type DeleteEdgeMutationErrorType =
  | 'NotFound'
  | 'NotAuthorized'
  | 'UnexpectedInput'
  | 'AssertionFailed';

export type DeleteNodeInput = {
  id: Scalars['ID'];
  nodeType: NodeType;
};

export type DeleteNodeMutationPayload = DeleteNodeMutationSuccess | DeleteNodeMutationError;

export type DeleteNodeMutationSuccess = {
  __typename: 'DeleteNodeMutationSuccess';
  nodeId?: Maybe<Scalars['ID']>;
};

export type DeleteNodeMutationError = {
  __typename: 'DeleteNodeMutationError';
  type?: Maybe<DeleteNodeMutationErrorType>;
  details?: Maybe<Scalars['String']>;
};

export type DeleteNodeMutationErrorType =
  | 'NotFound'
  | 'NotAuthorized'
  | 'AssertionFailed';

export type Page = {
  pageInfo: PageInfo;
  edges: Array<RelPageEdge | SearchPageEdge>;
};

export type PageInfo = {
  __typename: 'PageInfo';
  endCursor?: Maybe<Scalars['Cursor']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['Cursor']>;
};

export type PageEdge = {
  cursor: Scalars['Cursor'];
};

export type PaginationInput = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
};

export type Query = {
  __typename: 'Query';
  getSession?: Maybe<UserSession>;
  getUserSessionProfile?: Maybe<UserSession>;
  globalSearch: SearchPage;
  node?: Maybe<Node>;
};


export type QueryGetUserSessionProfileArgs = {
  profileId?: Maybe<Scalars['ID']>;
};


export type QueryGlobalSearchArgs = {
  text: Scalars['String'];
  nodeTypes?: Maybe<Array<NodeType>>;
  sortBy: GlobalSearchSort;
  page?: Maybe<PaginationInput>;
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
};


export type IContentNode = {
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
};

export type INode = {
  _created: GlyphByAt;
  _lastEdited?: Maybe<GlyphByAt>;
  _rel: RelPage;
  _relCount: Scalars['Int'];
  id: Scalars['ID'];
};


export type INode_RelArgs = {
  edge: EdgeTypeInput;
  page?: Maybe<PaginationInput>;
};


export type INode_RelCountArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
};

export type IEdge = {
  _created: GlyphByAt;
  _lastEdited?: Maybe<GlyphByAt>;
  id?: Maybe<Scalars['ID']>;
};

export type AppliesTo = IEdge & {
  __typename: 'AppliesTo';
  _created: GlyphByAt;
  _lastEdited?: Maybe<GlyphByAt>;
  id: Scalars['ID'];
};

export type Edge = AppliesTo | Contains | Created | Follows | Likes;

export type EdgeType =
  | 'AppliesTo'
  | 'Contains'
  | 'Created'
  | 'Follows'
  | 'Likes';

export type Contains = IEdge & {
  __typename: 'Contains';
  _created: GlyphByAt;
  _lastEdited?: Maybe<GlyphByAt>;
  id: Scalars['ID'];
};

export type Created = IEdge & {
  __typename: 'Created';
  _created: GlyphByAt;
  _lastEdited?: Maybe<GlyphByAt>;
  id: Scalars['ID'];
};

export type Follows = IEdge & {
  __typename: 'Follows';
  _created: GlyphByAt;
  _lastEdited?: Maybe<GlyphByAt>;
  id: Scalars['ID'];
};

export type Likes = IEdge & {
  __typename: 'Likes';
  _created: GlyphByAt;
  _lastEdited?: Maybe<GlyphByAt>;
  id: Scalars['ID'];
};

export type GlyphByAt = {
  __typename: 'GlyphByAt';
  by: Profile;
  at: Scalars['DateTime'];
};

export type Profile = IContentNode & INode & {
  __typename: 'Profile';
  _created: GlyphByAt;
  _lastEdited?: Maybe<GlyphByAt>;
  _rel: RelPage;
  _relCount: Scalars['Int'];
  icon?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  summary: Scalars['String'];
};


export type Profile_RelArgs = {
  edge: EdgeTypeInput;
  page?: Maybe<PaginationInput>;
};


export type Profile_RelCountArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
};

export type Collection = IContentNode & INode & {
  __typename: 'Collection';
  _created: GlyphByAt;
  _lastEdited?: Maybe<GlyphByAt>;
  _rel: RelPage;
  _relCount: Scalars['Int'];
  icon?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  summary: Scalars['String'];
};


export type Collection_RelArgs = {
  edge: EdgeTypeInput;
  page?: Maybe<PaginationInput>;
};


export type Collection_RelCountArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
};

export type Resource = IContentNode & INode & {
  __typename: 'Resource';
  _created: GlyphByAt;
  _lastEdited?: Maybe<GlyphByAt>;
  _rel: RelPage;
  _relCount: Scalars['Int'];
  icon?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  summary: Scalars['String'];
};


export type Resource_RelArgs = {
  edge: EdgeTypeInput;
  page?: Maybe<PaginationInput>;
};


export type Resource_RelCountArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
};

export type Subject = IContentNode & INode & {
  __typename: 'Subject';
  _created: GlyphByAt;
  _lastEdited?: Maybe<GlyphByAt>;
  _rel: RelPage;
  _relCount: Scalars['Int'];
  icon?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  summary: Scalars['String'];
};


export type Subject_RelArgs = {
  edge: EdgeTypeInput;
  page?: Maybe<PaginationInput>;
};


export type Subject_RelCountArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
};

export type EdgeTypeInput = {
  type: EdgeType;
  node: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
  targetMe?: Maybe<Scalars['Boolean']>;
  targetIDs?: Maybe<Array<Scalars['ID']>>;
};

export type RelPage = Page & {
  __typename: 'RelPage';
  pageInfo: PageInfo;
  edges: Array<RelPageEdge>;
};

export type RelPageEdge = PageEdge & {
  __typename: 'RelPageEdge';
  cursor: Scalars['Cursor'];
  edge: AppliesTo | Contains | Created | Follows | Likes;
  node: Profile | Collection | Resource | Subject;
};

export type UserSession = {
  __typename: 'UserSession';
  changeEmailRequest?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  profile?: Maybe<Profile>;
  profileId?: Maybe<Scalars['ID']>;
  userId: Scalars['String'];
  username: Scalars['String'];
};

export type CreateCollectionInput = {
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
};

export type UpdateCollectionInput = {
  name?: Maybe<Scalars['String']>;
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
};

export type Node = Collection | Profile | Resource | Subject;

export type NodeType =
  | 'Collection'
  | 'Profile'
  | 'Resource'
  | 'Subject';

export type UpdateProfileInput = {
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
};

export type CreateProfileInput = {
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
};

export type CreateResourceInput = {
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
};

export type UpdateResourceInput = {
  name?: Maybe<Scalars['String']>;
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
};

export type CreateSubjectInput = {
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
};

export type UpdateSubjectInput = {
  name?: Maybe<Scalars['String']>;
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
};

export type SearchPage = Page & {
  __typename: 'SearchPage';
  pageInfo: PageInfo;
  edges: Array<SearchPageEdge>;
};

export type SearchPageEdge = PageEdge & {
  __typename: 'SearchPageEdge';
  cursor: Scalars['Cursor'];
  node: Profile | Collection | Resource | Subject;
};

export type GlobalSearchSort =
  | 'Relevance'
  | 'Popularity';

export type SimpleResponse = {
  __typename: 'SimpleResponse';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
};

export type CreateSession = {
  __typename: 'CreateSession';
  jwt?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
};


      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "CreateNodeMutationPayload": [
      "CreateNodeMutationSuccess",
      "CreateNodeMutationError"
    ],
    "CreateEdgeMutationPayload": [
      "CreateEdgeMutationSuccess",
      "CreateEdgeMutationError"
    ],
    "UpdateNodeMutationPayload": [
      "UpdateNodeMutationSuccess",
      "UpdateNodeMutationError"
    ],
    "UpdateEdgeMutationPayload": [
      "UpdateEdgeMutationSuccess",
      "UpdateEdgeMutationError"
    ],
    "DeleteEdgeMutationPayload": [
      "DeleteEdgeMutationSuccess",
      "DeleteEdgeMutationError"
    ],
    "DeleteNodeMutationPayload": [
      "DeleteNodeMutationSuccess",
      "DeleteNodeMutationError"
    ],
    "Page": [
      "RelPage",
      "SearchPage"
    ],
    "PageEdge": [
      "RelPageEdge",
      "SearchPageEdge"
    ],
    "IContentNode": [
      "Profile",
      "Collection",
      "Resource",
      "Subject"
    ],
    "INode": [
      "Profile",
      "Collection",
      "Resource",
      "Subject"
    ],
    "IEdge": [
      "AppliesTo",
      "Contains",
      "Created",
      "Follows",
      "Likes"
    ],
    "Edge": [
      "AppliesTo",
      "Contains",
      "Created",
      "Follows",
      "Likes"
    ],
    "Node": [
      "Collection",
      "Profile",
      "Resource",
      "Subject"
    ]
  }
};
      export default result;
    