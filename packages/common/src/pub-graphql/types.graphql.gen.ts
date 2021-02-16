export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
  Cursor: any;
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
  Subject: Maybe<CreateSubjectInput>;
  User: Maybe<Scalars['Never']>;
  nodeType: NodeType;
};

export type CreateNodeMutationPayload = CreateNodeMutationSuccess | CreateNodeMutationError;

export type CreateNodeMutationSuccess = {
  __typename: 'CreateNodeMutationSuccess';
  node: Maybe<Node>;
};

export type CreateNodeMutationError = {
  __typename: 'CreateNodeMutationError';
  type: CreateNodeMutationErrorType;
  details: Maybe<Scalars['String']>;
};

export enum CreateNodeMutationErrorType {
  NotAuthorized = 'NotAuthorized',
  UnexpectedInput = 'UnexpectedInput'
}

export type CreateEdgeInput = {
  Follows: Maybe<Scalars['Empty']>;
  edgeType: EdgeType;
  from: Scalars['ID'];
  to: Scalars['ID'];
};

export type CreateEdgeMutationPayload = CreateEdgeMutationSuccess | CreateEdgeMutationError;

export type CreateEdgeMutationSuccess = {
  __typename: 'CreateEdgeMutationSuccess';
  edge: Maybe<Edge>;
};

export type CreateEdgeMutationError = {
  __typename: 'CreateEdgeMutationError';
  type: CreateEdgeMutationErrorType;
  details: Maybe<Scalars['String']>;
};

export enum CreateEdgeMutationErrorType {
  NotAuthorized = 'NotAuthorized',
  NotAllowed = 'NotAllowed',
  NoSelfReference = 'NoSelfReference',
  UnexpectedInput = 'UnexpectedInput'
}

export type UpdateNodeInput = {
  Subject: Maybe<UpdateSubjectInput>;
  User: Maybe<UpdateUserInput>;
  _id: Scalars['ID'];
  nodeType: NodeType;
};

export type UpdateNodeMutationPayload = UpdateNodeMutationSuccess | UpdateNodeMutationError;

export type UpdateNodeMutationSuccess = {
  __typename: 'UpdateNodeMutationSuccess';
  node: Maybe<Node>;
};

export type UpdateNodeMutationError = {
  __typename: 'UpdateNodeMutationError';
  type: UpdateNodeMutationErrorType;
  details: Maybe<Scalars['String']>;
};

export enum UpdateNodeMutationErrorType {
  NotFound = 'NotFound',
  NotAuthorized = 'NotAuthorized',
  UnexpectedInput = 'UnexpectedInput'
}

export type UpdateEdgeInput = {
  Follows: Maybe<Scalars['Empty']>;
  edgeType: EdgeType;
  id: Scalars['ID'];
};

export type UpdateEdgeMutationPayload = UpdateEdgeMutationSuccess | UpdateEdgeMutationError;

export type UpdateEdgeMutationSuccess = {
  __typename: 'UpdateEdgeMutationSuccess';
  edge: Maybe<Edge>;
};

export type UpdateEdgeMutationError = {
  __typename: 'UpdateEdgeMutationError';
  type: UpdateEdgeMutationErrorType;
  details: Maybe<Scalars['String']>;
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
  edge: Maybe<Edge>;
};

export type DeleteEdgeMutationError = {
  __typename: 'DeleteEdgeMutationError';
  type: Maybe<DeleteEdgeMutationErrorType>;
  details: Maybe<Scalars['String']>;
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
  node: Maybe<Node>;
};

export type DeleteNodeMutationError = {
  __typename: 'DeleteNodeMutationError';
  type: Maybe<DeleteNodeMutationErrorType>;
  details: Maybe<Scalars['String']>;
};

export enum DeleteNodeMutationErrorType {
  NotFound = 'NotFound',
  NotAuthorized = 'NotAuthorized'
}

export type Page = {
  __typename: 'Page';
  pageInfo: PageInfo;
  edges: Array<PageEdge>;
};

export type PageInfo = {
  __typename: 'PageInfo';
  endCursor: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor: Maybe<Scalars['String']>;
};

export type PageEdge = {
  __typename: 'PageEdge';
  cursor: Scalars['String'];
  edge: IEdge;
  node: INode;
};

export type PageInput = {
  first: Maybe<Scalars['Int']>;
  after: Maybe<Scalars['String']>;
  before: Maybe<Scalars['String']>;
  last: Maybe<Scalars['Int']>;
};

export type Query = {
  __typename: 'Query';
  getSession: Maybe<UserSession>;
  getSessionAccountUser: Maybe<UserSession>;
  node: Maybe<Node>;
};


export type QueryGetSessionAccountUserArgs = {
  username: Scalars['String'];
};


export type QueryNodeArgs = {
  _id: Scalars['ID'];
  nodeType: NodeType;
};


export type INode = {
  _id: Maybe<Scalars['ID']>;
  _meta: Meta;
  _rel: Page;
};


export type INode_RelArgs = {
  edge: EdgeTypeInput;
  page: Maybe<PageInput>;
};

export type IEdge = {
  _id: Maybe<Scalars['ID']>;
  _meta: Meta;
};

export type EdgeTypeInput = {
  type: EdgeType;
  node: NodeType;
  inverse: Maybe<Scalars['Boolean']>;
};

export type Meta = {
  __typename: 'Meta';
  created: ByAt;
  lastUpdate: ByAt;
};

export type ByAt = {
  __typename: 'ByAt';
  by: User;
  at: Scalars['DateTime'];
};

export enum Role {
  User = 'User',
  Admin = 'Admin',
  Root = 'Root',
  Moderator = 'Moderator'
}

export type Follows = IEdge & {
  __typename: 'Follows';
  _id: Scalars['ID'];
  _meta: Meta;
};

export type Edge = Follows;

export enum EdgeType {
  Follows = 'Follows'
}

export type UserSession = {
  __typename: 'UserSession';
  accountId: Scalars['String'];
  changeEmailRequest: Maybe<Scalars['String']>;
  email: Scalars['String'];
  user: User;
  username: Scalars['String'];
};

export type Subject = INode & {
  __typename: 'Subject';
  _id: Scalars['ID'];
  _meta: Meta;
  _rel: Page;
  name: Scalars['String'];
};


export type Subject_RelArgs = {
  edge: EdgeTypeInput;
  page: Maybe<PageInput>;
};

export type Node = Subject | User;

export enum NodeType {
  Subject = 'Subject',
  User = 'User'
}

export type CreateSubjectInput = {
  name: Scalars['String'];
};

export type UpdateSubjectInput = {
  name: Maybe<Scalars['String']>;
};

export type User = INode & {
  __typename: 'User';
  _id: Scalars['ID'];
  _meta: Meta;
  _rel: Page;
  role: Role;
  displayName: Scalars['String'];
};


export type User_RelArgs = {
  edge: EdgeTypeInput;
  page: Maybe<PageInput>;
};

export type UpdateUserInput = {
  displayName: Maybe<Scalars['String']>;
};

export type SimpleResponse = {
  __typename: 'SimpleResponse';
  success: Scalars['Boolean'];
  message: Maybe<Scalars['String']>;
};

export type CreateSession = {
  __typename: 'CreateSession';
  jwt: Maybe<Scalars['String']>;
  message: Maybe<Scalars['String']>;
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
    "INode": [
      "Subject",
      "User"
    ],
    "IEdge": [
      "Follows"
    ],
    "Edge": [
      "Follows"
    ],
    "Node": [
      "Subject",
      "User"
    ]
  }
};
      export default result;
    