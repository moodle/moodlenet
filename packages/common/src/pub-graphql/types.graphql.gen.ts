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




export type Mutation = {
  __typename: 'Mutation';
  activateAccount: CreateSession;
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


export type MutationActivateAccountArgs = {
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
  Resource?: Maybe<CreateResourceInput>;
  Subject?: Maybe<CreateSubjectInput>;
  User?: Maybe<CreateUserInput>;
  nodeType: NodeType;
};

export type CreateNodeMutationPayload = CreateNodeMutationSuccess | CreateNodeMutationError;

export type CreateNodeMutationSuccess = {
  __typename: 'CreateNodeMutationSuccess';
  node?: Maybe<Node>;
};

export type CreateNodeMutationError = {
  __typename: 'CreateNodeMutationError';
  type: CreateNodeMutationErrorType;
  details?: Maybe<Scalars['String']>;
};

export enum CreateNodeMutationErrorType {
  NotAuthorized = 'NotAuthorized',
  UnexpectedInput = 'UnexpectedInput'
}

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
  edge?: Maybe<Edge>;
};

export type CreateEdgeMutationError = {
  __typename: 'CreateEdgeMutationError';
  type: CreateEdgeMutationErrorType;
  details?: Maybe<Scalars['String']>;
};

export enum CreateEdgeMutationErrorType {
  NotAuthorized = 'NotAuthorized',
  NotAllowed = 'NotAllowed',
  NoSelfReference = 'NoSelfReference',
  UnexpectedInput = 'UnexpectedInput'
}

export type UpdateNodeInput = {
  Collection?: Maybe<UpdateCollectionInput>;
  Resource?: Maybe<UpdateResourceInput>;
  Subject?: Maybe<UpdateSubjectInput>;
  User?: Maybe<UpdateUserInput>;
  _id: Scalars['ID'];
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

export enum UpdateNodeMutationErrorType {
  NotFound = 'NotFound',
  NotAuthorized = 'NotAuthorized',
  UnexpectedInput = 'UnexpectedInput'
}

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

export enum UpdateEdgeMutationErrorType {
  NotFound = 'NotFound',
  NotAuthorized = 'NotAuthorized',
  UnexpectedInput = 'UnexpectedInput'
}

export type DeleteEdgeInput = {
  _id: Scalars['ID'];
  edgeType: EdgeType;
};

export type DeleteEdgeMutationPayload = DeleteEdgeMutationSuccess | DeleteEdgeMutationError;

export type DeleteEdgeMutationSuccess = {
  __typename: 'DeleteEdgeMutationSuccess';
  edge?: Maybe<Edge>;
};

export type DeleteEdgeMutationError = {
  __typename: 'DeleteEdgeMutationError';
  type?: Maybe<DeleteEdgeMutationErrorType>;
  details?: Maybe<Scalars['String']>;
};

export enum DeleteEdgeMutationErrorType {
  NotFound = 'NotFound',
  NotAuthorized = 'NotAuthorized'
}

export type DeleteNodeInput = {
  _id: Scalars['ID'];
  nodeType: NodeType;
};

export type DeleteNodeMutationPayload = DeleteNodeMutationSuccess | DeleteNodeMutationError;

export type DeleteNodeMutationSuccess = {
  __typename: 'DeleteNodeMutationSuccess';
  node?: Maybe<Node>;
};

export type DeleteNodeMutationError = {
  __typename: 'DeleteNodeMutationError';
  type?: Maybe<DeleteNodeMutationErrorType>;
  details?: Maybe<Scalars['String']>;
};

export enum DeleteNodeMutationErrorType {
  NotFound = 'NotFound',
  NotAuthorized = 'NotAuthorized'
}

export type Page = {
  pageInfo: PageInfo;
  edges: Array<SearchPageEdge | RelPageEdge>;
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
  getSessionAccountUser?: Maybe<UserSession>;
  globalSearch: SearchPage;
  node?: Maybe<Node>;
};


export type QueryGetSessionAccountUserArgs = {
  userId?: Maybe<Scalars['ID']>;
};


export type QueryGlobalSearchArgs = {
  text: Scalars['String'];
  page?: Maybe<PaginationInput>;
};


export type QueryNodeArgs = {
  _id: Scalars['ID'];
};

export type SearchPage = Page & {
  __typename: 'SearchPage';
  pageInfo: PageInfo;
  edges: Array<SearchPageEdge>;
};

export type SearchPageEdge = PageEdge & {
  __typename: 'SearchPageEdge';
  cursor: Scalars['Cursor'];
  node: Collection | Resource | Subject | User;
};


export type INode = {
  _id?: Maybe<Scalars['ID']>;
  _rel: RelPage;
  _meta: NodeMeta;
};


export type INode_RelArgs = {
  edge: EdgeTypeInput;
  page?: Maybe<PaginationInput>;
  sort?: Maybe<Array<NodeRelSort>>;
};

export type NodeMeta = {
  __typename: 'NodeMeta';
  creator: User;
  created: Scalars['DateTime'];
  updated: Scalars['DateTime'];
  relCount?: Maybe<RelCountMap>;
};

export type EdgeMeta = {
  __typename: 'EdgeMeta';
  created: Scalars['DateTime'];
  updated: Scalars['DateTime'];
};

export type RelCount = {
  __typename: 'RelCount';
  to?: Maybe<RelCountTargetMap>;
  from?: Maybe<RelCountTargetMap>;
};

export type NodeRelSort = {
  prop: Scalars['String'];
  desc?: Maybe<Scalars['Boolean']>;
  edge?: Maybe<Scalars['Boolean']>;
};

export type IContentNode = {
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
};

export type IEdge = {
  _id?: Maybe<Scalars['ID']>;
  _meta?: Maybe<EdgeMeta>;
};

export type EdgeTypeInput = {
  type: EdgeType;
  node: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
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
  node: Collection | Resource | Subject | User;
};

export type AppliesTo = IEdge & {
  __typename: 'AppliesTo';
  _id: Scalars['ID'];
  _meta?: Maybe<EdgeMeta>;
};

export type RelCountMap = {
  __typename: 'RelCountMap';
  AppliesTo?: Maybe<RelCount>;
  Contains?: Maybe<RelCount>;
  Created?: Maybe<RelCount>;
  Follows?: Maybe<RelCount>;
  Likes?: Maybe<RelCount>;
};

export type Edge = AppliesTo | Contains | Created | Follows | Likes;

export enum EdgeType {
  AppliesTo = 'AppliesTo',
  Contains = 'Contains',
  Created = 'Created',
  Follows = 'Follows',
  Likes = 'Likes'
}

export type Contains = IEdge & {
  __typename: 'Contains';
  _id: Scalars['ID'];
  _meta?: Maybe<EdgeMeta>;
};

export type Created = IEdge & {
  __typename: 'Created';
  _id: Scalars['ID'];
  _meta?: Maybe<EdgeMeta>;
};

export type Follows = IEdge & {
  __typename: 'Follows';
  _id: Scalars['ID'];
  _meta?: Maybe<EdgeMeta>;
};

export type Likes = IEdge & {
  __typename: 'Likes';
  _id: Scalars['ID'];
  _meta?: Maybe<EdgeMeta>;
};

export type UserSession = {
  __typename: 'UserSession';
  accountId: Scalars['String'];
  changeEmailRequest?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  user?: Maybe<User>;
  userId?: Maybe<Scalars['ID']>;
  username: Scalars['String'];
};

export type Collection = INode & IContentNode & {
  __typename: 'Collection';
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
  _id: Scalars['ID'];
  _meta: NodeMeta;
  _rel: RelPage;
};


export type Collection_RelArgs = {
  edge: EdgeTypeInput;
  page?: Maybe<PaginationInput>;
  sort?: Maybe<Array<NodeRelSort>>;
};

export type Node = Collection | Resource | Subject | User;

export enum NodeType {
  Collection = 'Collection',
  Resource = 'Resource',
  Subject = 'Subject',
  User = 'User'
}

export type RelCountTargetMap = {
  __typename: 'RelCountTargetMap';
  Collection?: Maybe<Scalars['Int']>;
  Resource?: Maybe<Scalars['Int']>;
  Subject?: Maybe<Scalars['Int']>;
  User?: Maybe<Scalars['Int']>;
};

export type CreateCollectionInput = {
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
};

export type UpdateCollectionInput = {
  name?: Maybe<Scalars['String']>;
};

export type Resource = INode & IContentNode & {
  __typename: 'Resource';
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
  _id: Scalars['ID'];
  _meta: NodeMeta;
  _rel: RelPage;
};


export type Resource_RelArgs = {
  edge: EdgeTypeInput;
  page?: Maybe<PaginationInput>;
  sort?: Maybe<Array<NodeRelSort>>;
};

export type CreateResourceInput = {
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
};

export type UpdateResourceInput = {
  name?: Maybe<Scalars['String']>;
};

export type Subject = INode & IContentNode & {
  __typename: 'Subject';
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
  _id: Scalars['ID'];
  _meta: NodeMeta;
  _rel: RelPage;
};


export type Subject_RelArgs = {
  edge: EdgeTypeInput;
  page?: Maybe<PaginationInput>;
  sort?: Maybe<Array<NodeRelSort>>;
};

export type CreateSubjectInput = {
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
};

export type UpdateSubjectInput = {
  name?: Maybe<Scalars['String']>;
};

export type User = INode & IContentNode & {
  __typename: 'User';
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
  _id: Scalars['ID'];
  _meta: NodeMeta;
  _rel: RelPage;
};


export type User_RelArgs = {
  edge: EdgeTypeInput;
  page?: Maybe<PaginationInput>;
  sort?: Maybe<Array<NodeRelSort>>;
};

export type UpdateUserInput = {
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
};

export type CreateUserInput = {
  name: Scalars['String'];
  summary: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
};

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
      "SearchPage",
      "RelPage"
    ],
    "PageEdge": [
      "SearchPageEdge",
      "RelPageEdge"
    ],
    "INode": [
      "Collection",
      "Resource",
      "Subject",
      "User"
    ],
    "IContentNode": [
      "Collection",
      "Resource",
      "Subject",
      "User"
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
      "Resource",
      "Subject",
      "User"
    ]
  }
};
      export default result;
    