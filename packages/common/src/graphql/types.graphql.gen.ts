import { ID } from './scalars.graphql';
import { AssetRef } from './scalars.graphql';
import { Cursor } from './scalars.graphql';
import { Empty } from './scalars.graphql';
import { Never } from './scalars.graphql';
import { Timestamp } from './scalars.graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: ID;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AssetRef: AssetRef;
  Cursor: Cursor;
  Empty: Empty;
  Never: Never;
  Timestamp: Timestamp;
};


export type AssetRefInput = {
  type: AssetRefInputType;
  location: Scalars['String'];
};

export type AssetRefInputType =
  | 'TmpUpload'
  | 'ExternalUrl'
  | 'NoChange'
  | 'NoAsset';

export type Collection = INode & {
  __typename: 'Collection';
  name: Scalars['String'];
  description: Scalars['String'];
  image?: Maybe<Scalars['AssetRef']>;
  id: Scalars['ID'];
  _rel: RelPage;
  _relCount: Scalars['Int'];
};


export type Collection_RelArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
  page?: Maybe<PaginationInput>;
};


export type Collection_RelCountArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
};

export type CreateCollectionInput = {
  name: Scalars['String'];
  description: Scalars['String'];
  image: AssetRefInput;
  slug: Scalars['String'];
};

export type CreateEdgeInput = {
  Created?: Maybe<Scalars['Empty']>;
  Features?: Maybe<Scalars['Empty']>;
  Follows?: Maybe<Scalars['Empty']>;
  Pinned?: Maybe<Scalars['Empty']>;
  edgeType: EdgeType;
  from: Scalars['ID'];
  to: Scalars['ID'];
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

export type CreateEdgeMutationPayload = CreateEdgeMutationSuccess | CreateEdgeMutationError;

export type CreateEdgeMutationSuccess = {
  __typename: 'CreateEdgeMutationSuccess';
  edge: Edge;
};

export type CreateNodeInput = {
  Collection?: Maybe<CreateCollectionInput>;
  IscedField?: Maybe<Scalars['Never']>;
  IscedGrade?: Maybe<Scalars['Never']>;
  Organization?: Maybe<Scalars['Never']>;
  Profile?: Maybe<Scalars['Never']>;
  Resource?: Maybe<CreateResourceInput>;
  nodeType: NodeType;
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

export type CreateNodeMutationPayload = CreateNodeMutationSuccess | CreateNodeMutationError;

export type CreateNodeMutationSuccess = {
  __typename: 'CreateNodeMutationSuccess';
  node: Node;
};

export type CreateResourceInput = {
  name: Scalars['String'];
  description: Scalars['String'];
  thumbnail?: Maybe<AssetRefInput>;
  content: AssetRefInput;
  slug: Scalars['String'];
};

export type CreateSession = {
  __typename: 'CreateSession';
  jwt?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
};

export type Created = IEdge & {
  __typename: 'Created';
  id: Scalars['ID'];
  _created: Scalars['Timestamp'];
};


export type DeleteEdgeInput = {
  id: Scalars['ID'];
  edgeType: EdgeType;
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

export type DeleteEdgeMutationPayload = DeleteEdgeMutationSuccess | DeleteEdgeMutationError;

export type DeleteEdgeMutationSuccess = {
  __typename: 'DeleteEdgeMutationSuccess';
  edgeId?: Maybe<Scalars['ID']>;
};

export type DeleteNodeInput = {
  id: Scalars['ID'];
  nodeType: NodeType;
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

export type DeleteNodeMutationPayload = DeleteNodeMutationSuccess | DeleteNodeMutationError;

export type DeleteNodeMutationSuccess = {
  __typename: 'DeleteNodeMutationSuccess';
  nodeId?: Maybe<Scalars['ID']>;
};

export type Edge = Created | Features | Follows | Pinned;

export type EdgeType =
  | 'Created'
  | 'Features'
  | 'Follows'
  | 'Pinned';

export type EditCollectionInput = {
  name: Scalars['String'];
  description: Scalars['String'];
  image: AssetRefInput;
  slug: Scalars['String'];
};

export type EditNodeInput = {
  Collection?: Maybe<EditCollectionInput>;
  IscedField?: Maybe<Scalars['Never']>;
  IscedGrade?: Maybe<Scalars['Never']>;
  Organization?: Maybe<Scalars['Never']>;
  Profile?: Maybe<EditProfileInput>;
  Resource?: Maybe<EditResourceInput>;
  id: Scalars['ID'];
  nodeType: NodeType;
};

export type EditNodeMutationError = {
  __typename: 'EditNodeMutationError';
  type: EditNodeMutationErrorType;
  details?: Maybe<Scalars['String']>;
};

export type EditNodeMutationErrorType =
  | 'NotFound'
  | 'NotAuthorized'
  | 'UnexpectedInput'
  | 'AssertionFailed';

export type EditNodeMutationPayload = EditNodeMutationSuccess | EditNodeMutationError;

export type EditNodeMutationSuccess = {
  __typename: 'EditNodeMutationSuccess';
  node?: Maybe<Node>;
};

export type EditProfileInput = {
  name: Scalars['String'];
  avatar?: Maybe<Scalars['AssetRef']>;
  bio: Scalars['String'];
  image?: Maybe<Scalars['AssetRef']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  siteUrl?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  slug: Scalars['String'];
};

export type EditResourceInput = {
  name: Scalars['String'];
  description: Scalars['String'];
  image?: Maybe<AssetRefInput>;
};


export type Features = IEdge & {
  __typename: 'Features';
  id: Scalars['ID'];
  _created: Scalars['Timestamp'];
};

export type Follows = IEdge & {
  __typename: 'Follows';
  id: Scalars['ID'];
  _created: Scalars['Timestamp'];
};

export type GlobalSearchSort =
  | 'Relevance'
  | 'Popularity'
  | 'Recent';

export type IEdge = {
  id?: Maybe<Scalars['ID']>;
  _created: Scalars['Timestamp'];
};

export type INode = {
  id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  _rel: RelPage;
  _relCount: Scalars['Int'];
};


export type INode_RelArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
  page?: Maybe<PaginationInput>;
};


export type INode_RelCountArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
};

export type IscedField = INode & {
  __typename: 'IscedField';
  name: Scalars['String'];
  description: Scalars['String'];
  codePath: Array<Scalars['String']>;
  code: Scalars['String'];
  thumbnail?: Maybe<Scalars['AssetRef']>;
  image?: Maybe<Scalars['AssetRef']>;
  id: Scalars['ID'];
  _rel: RelPage;
  _relCount: Scalars['Int'];
};


export type IscedField_RelArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
  page?: Maybe<PaginationInput>;
};


export type IscedField_RelCountArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
};

export type IscedGrade = INode & {
  __typename: 'IscedGrade';
  name: Scalars['String'];
  description: Scalars['String'];
  codePath: Array<Scalars['String']>;
  code: Scalars['String'];
  thumbnail?: Maybe<Scalars['AssetRef']>;
  image?: Maybe<Scalars['AssetRef']>;
  id: Scalars['ID'];
  _rel: RelPage;
  _relCount: Scalars['Int'];
};


export type IscedGrade_RelArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
  page?: Maybe<PaginationInput>;
};


export type IscedGrade_RelCountArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
};

export type Mutation = {
  __typename: 'Mutation';
  activateUser: CreateSession;
  createNode: CreateNodeMutationPayload;
  createSession: CreateSession;
  signUp: SimpleResponse;
};


export type MutationActivateUserArgs = {
  name: Scalars['String'];
  password: Scalars['String'];
  activationToken: Scalars['String'];
};


export type MutationCreateNodeArgs = {
  input: CreateNodeInput;
};


export type MutationCreateSessionArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSignUpArgs = {
  email: Scalars['String'];
};


export type Node = Collection | IscedField | IscedGrade | Organization | Profile | Resource;

export type NodeType =
  | 'Collection'
  | 'IscedField'
  | 'IscedGrade'
  | 'Organization'
  | 'Profile'
  | 'Resource';

export type Organization = INode & {
  __typename: 'Organization';
  name: Scalars['String'];
  description: Scalars['String'];
  intro: Scalars['String'];
  logo?: Maybe<Scalars['AssetRef']>;
  image?: Maybe<Scalars['AssetRef']>;
  color: Scalars['String'];
  domain: Scalars['String'];
  id: Scalars['ID'];
  _rel: RelPage;
  _relCount: Scalars['Int'];
};


export type Organization_RelArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
  page?: Maybe<PaginationInput>;
};


export type Organization_RelCountArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
};

export type Page = {
  pageInfo: PageInfo;
  edges: Array<RelPageEdge | SearchPageEdge>;
};

export type PageEdge = {
  cursor: Scalars['Cursor'];
};

export type PageInfo = {
  __typename: 'PageInfo';
  endCursor?: Maybe<Scalars['Cursor']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['Cursor']>;
};

export type PaginationInput = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
};

export type Pinned = IEdge & {
  __typename: 'Pinned';
  id: Scalars['ID'];
  _created: Scalars['Timestamp'];
};

export type Profile = INode & {
  __typename: 'Profile';
  name: Scalars['String'];
  description: Scalars['String'];
  avatar?: Maybe<Scalars['AssetRef']>;
  bio: Scalars['String'];
  image?: Maybe<Scalars['AssetRef']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  siteUrl?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  _rel: RelPage;
  _relCount: Scalars['Int'];
};


export type Profile_RelArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
  page?: Maybe<PaginationInput>;
};


export type Profile_RelCountArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
};

export type Query = {
  __typename: 'Query';
  getSession?: Maybe<UserSession>;
  globalSearch: SearchPage;
  node?: Maybe<Node>;
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

export type RelPage = Page & {
  __typename: 'RelPage';
  pageInfo: PageInfo;
  edges: Array<RelPageEdge>;
};

export type RelPageEdge = PageEdge & {
  __typename: 'RelPageEdge';
  cursor: Scalars['Cursor'];
  edge: Created | Features | Follows | Pinned;
  node: Collection | IscedField | IscedGrade | Organization | Profile | Resource;
};

export type Resource = INode & {
  __typename: 'Resource';
  name: Scalars['String'];
  description: Scalars['String'];
  thumbnail?: Maybe<Scalars['AssetRef']>;
  content: Scalars['AssetRef'];
  kind: ResourceKind;
  id: Scalars['ID'];
  _rel: RelPage;
  _relCount: Scalars['Int'];
};


export type Resource_RelArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
  page?: Maybe<PaginationInput>;
};


export type Resource_RelCountArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
};

export type ResourceKind =
  | 'Upload'
  | 'Link';

export type SearchPage = Page & {
  __typename: 'SearchPage';
  pageInfo: PageInfo;
  edges: Array<SearchPageEdge>;
};

export type SearchPageEdge = PageEdge & {
  __typename: 'SearchPageEdge';
  cursor: Scalars['Cursor'];
  node: Collection | IscedField | IscedGrade | Organization | Profile | Resource;
};

export type SimpleResponse = {
  __typename: 'SimpleResponse';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
};


export type UpdateEdgeInput = {
  Created?: Maybe<Scalars['Empty']>;
  Features?: Maybe<Scalars['Empty']>;
  Follows?: Maybe<Scalars['Empty']>;
  Pinned?: Maybe<Scalars['Empty']>;
  edgeType: EdgeType;
  id: Scalars['ID'];
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

export type UpdateEdgeMutationPayload = UpdateEdgeMutationSuccess | UpdateEdgeMutationError;

export type UpdateEdgeMutationSuccess = {
  __typename: 'UpdateEdgeMutationSuccess';
  edge?: Maybe<Edge>;
};

export type UserSession = {
  __typename: 'UserSession';
  email: Scalars['String'];
  profile: Profile;
};


      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "CreateEdgeMutationPayload": [
      "CreateEdgeMutationSuccess",
      "CreateEdgeMutationError"
    ],
    "CreateNodeMutationPayload": [
      "CreateNodeMutationSuccess",
      "CreateNodeMutationError"
    ],
    "DeleteEdgeMutationPayload": [
      "DeleteEdgeMutationSuccess",
      "DeleteEdgeMutationError"
    ],
    "DeleteNodeMutationPayload": [
      "DeleteNodeMutationSuccess",
      "DeleteNodeMutationError"
    ],
    "Edge": [
      "Created",
      "Features",
      "Follows",
      "Pinned"
    ],
    "EditNodeMutationPayload": [
      "EditNodeMutationSuccess",
      "EditNodeMutationError"
    ],
    "IEdge": [
      "Created",
      "Features",
      "Follows",
      "Pinned"
    ],
    "INode": [
      "Collection",
      "IscedField",
      "IscedGrade",
      "Organization",
      "Profile",
      "Resource"
    ],
    "Node": [
      "Collection",
      "IscedField",
      "IscedGrade",
      "Organization",
      "Profile",
      "Resource"
    ],
    "Page": [
      "RelPage",
      "SearchPage"
    ],
    "PageEdge": [
      "RelPageEdge",
      "SearchPageEdge"
    ],
    "UpdateEdgeMutationPayload": [
      "UpdateEdgeMutationSuccess",
      "UpdateEdgeMutationError"
    ]
  }
};
      export default result;
    