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
};

export type CreateEdgeInput = {
  Created?: Maybe<Scalars['Empty']>;
  Features?: Maybe<Scalars['Empty']>;
  Follows?: Maybe<Scalars['Empty']>;
  Likes?: Maybe<Scalars['Empty']>;
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
  FileFormat?: Maybe<Scalars['Never']>;
  IscedField?: Maybe<Scalars['Never']>;
  IscedGrade?: Maybe<Scalars['Never']>;
  Language?: Maybe<Scalars['Never']>;
  License?: Maybe<Scalars['Never']>;
  Organization?: Maybe<Scalars['Never']>;
  Profile?: Maybe<Scalars['Never']>;
  Resource?: Maybe<CreateResourceInput>;
  ResourceType?: Maybe<Scalars['Never']>;
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
  image?: Maybe<AssetRefInput>;
  content: AssetRefInput;
  originalCreationDate?: Maybe<Scalars['Timestamp']>;
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
  edgeId: Scalars['ID'];
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

export type Edge = Created | Features | Follows | Likes | Pinned;

export type EdgeType =
  | 'Created'
  | 'Features'
  | 'Follows'
  | 'Likes'
  | 'Pinned';

export type EditCollectionInput = {
  name: Scalars['String'];
  description: Scalars['String'];
  image?: Maybe<AssetRefInput>;
};

export type EditEdgeInput = {
  Created?: Maybe<Scalars['Empty']>;
  Features?: Maybe<Scalars['Empty']>;
  Follows?: Maybe<Scalars['Empty']>;
  Likes?: Maybe<Scalars['Empty']>;
  Pinned?: Maybe<Scalars['Empty']>;
  edgeType: EdgeType;
  id: Scalars['ID'];
};

export type EditEdgeMutationError = {
  __typename: 'EditEdgeMutationError';
  type: EditEdgeMutationErrorType;
  details?: Maybe<Scalars['String']>;
};

export type EditEdgeMutationErrorType =
  | 'NotFound'
  | 'NotAuthorized'
  | 'UnexpectedInput'
  | 'AssertionFailed';

export type EditEdgeMutationPayload = EditEdgeMutationSuccess | EditEdgeMutationError;

export type EditEdgeMutationSuccess = {
  __typename: 'EditEdgeMutationSuccess';
  edge?: Maybe<Edge>;
};

export type EditNodeInput = {
  Collection?: Maybe<EditCollectionInput>;
  FileFormat?: Maybe<Scalars['Never']>;
  IscedField?: Maybe<Scalars['Never']>;
  IscedGrade?: Maybe<Scalars['Never']>;
  Language?: Maybe<Scalars['Never']>;
  License?: Maybe<Scalars['Never']>;
  Organization?: Maybe<Scalars['Never']>;
  Profile?: Maybe<EditProfileInput>;
  Resource?: Maybe<EditResourceInput>;
  ResourceType?: Maybe<Scalars['Never']>;
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
  originalCreationDate?: Maybe<Scalars['Timestamp']>;
};


export type Features = IEdge & {
  __typename: 'Features';
  id: Scalars['ID'];
  _created: Scalars['Timestamp'];
};

export type FileFormat = INode & {
  __typename: 'FileFormat';
  code: Scalars['String'];
  type: FileFormatType;
  subtype: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  _rel: RelPage;
  _relCount: Scalars['Int'];
};


export type FileFormat_RelArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
  page?: Maybe<PaginationInput>;
};


export type FileFormat_RelCountArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
};

export type FileFormatType =
  | 'application'
  | 'audio'
  | 'font'
  | 'image'
  | 'message'
  | 'model'
  | 'multipart'
  | 'text'
  | 'video';

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

export type Language = INode & {
  __typename: 'Language';
  part2b?: Maybe<Scalars['String']>;
  part2t?: Maybe<Scalars['String']>;
  part1?: Maybe<Scalars['String']>;
  scope: Scalars['String'];
  langType: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  _rel: RelPage;
  _relCount: Scalars['Int'];
};


export type Language_RelArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
  page?: Maybe<PaginationInput>;
};


export type Language_RelCountArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
};

export type License = INode & {
  __typename: 'License';
  code: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  _rel: RelPage;
  _relCount: Scalars['Int'];
};


export type License_RelArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
  page?: Maybe<PaginationInput>;
};


export type License_RelCountArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
};

export type Likes = IEdge & {
  __typename: 'Likes';
  id: Scalars['ID'];
  _created: Scalars['Timestamp'];
};

export type Mutation = {
  __typename: 'Mutation';
  activateUser: CreateSession;
  createEdge: CreateEdgeMutationPayload;
  createNode: CreateNodeMutationPayload;
  createSession: CreateSession;
  deleteEdge: DeleteEdgeMutationPayload;
  editNode: EditNodeMutationPayload;
  signUp: SimpleResponse;
};


export type MutationActivateUserArgs = {
  name: Scalars['String'];
  password: Scalars['String'];
  activationToken: Scalars['String'];
};


export type MutationCreateEdgeArgs = {
  input: CreateEdgeInput;
};


export type MutationCreateNodeArgs = {
  input: CreateNodeInput;
};


export type MutationCreateSessionArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationDeleteEdgeArgs = {
  input: DeleteEdgeInput;
};


export type MutationEditNodeArgs = {
  input: EditNodeInput;
};


export type MutationSignUpArgs = {
  email: Scalars['String'];
};


export type Node = Collection | FileFormat | IscedField | IscedGrade | Language | License | Organization | Profile | Resource | ResourceType;

export type NodeType =
  | 'Collection'
  | 'FileFormat'
  | 'IscedField'
  | 'IscedGrade'
  | 'Language'
  | 'License'
  | 'Organization'
  | 'Profile'
  | 'Resource'
  | 'ResourceType';

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
  edge: Created | Features | Follows | Likes | Pinned;
  node: Collection | FileFormat | IscedField | IscedGrade | Language | License | Organization | Profile | Resource | ResourceType;
};

export type Resource = INode & {
  __typename: 'Resource';
  name: Scalars['String'];
  description: Scalars['String'];
  image?: Maybe<Scalars['AssetRef']>;
  content: Scalars['AssetRef'];
  kind: ResourceKind;
  originalCreationDate?: Maybe<Scalars['Timestamp']>;
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

export type ResourceType = INode & {
  __typename: 'ResourceType';
  code: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  _rel: RelPage;
  _relCount: Scalars['Int'];
};


export type ResourceType_RelArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
  page?: Maybe<PaginationInput>;
};


export type ResourceType_RelCountArgs = {
  type: EdgeType;
  target: NodeType;
  inverse?: Maybe<Scalars['Boolean']>;
};

export type SearchPage = Page & {
  __typename: 'SearchPage';
  pageInfo: PageInfo;
  edges: Array<SearchPageEdge>;
};

export type SearchPageEdge = PageEdge & {
  __typename: 'SearchPageEdge';
  cursor: Scalars['Cursor'];
  node: Collection | FileFormat | IscedField | IscedGrade | Language | License | Organization | Profile | Resource | ResourceType;
};

export type SimpleResponse = {
  __typename: 'SimpleResponse';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
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
      "Likes",
      "Pinned"
    ],
    "EditEdgeMutationPayload": [
      "EditEdgeMutationSuccess",
      "EditEdgeMutationError"
    ],
    "EditNodeMutationPayload": [
      "EditNodeMutationSuccess",
      "EditNodeMutationError"
    ],
    "IEdge": [
      "Created",
      "Features",
      "Follows",
      "Likes",
      "Pinned"
    ],
    "INode": [
      "Collection",
      "FileFormat",
      "IscedField",
      "IscedGrade",
      "Language",
      "License",
      "Organization",
      "Profile",
      "Resource",
      "ResourceType"
    ],
    "Node": [
      "Collection",
      "FileFormat",
      "IscedField",
      "IscedGrade",
      "Language",
      "License",
      "Organization",
      "Profile",
      "Resource",
      "ResourceType"
    ],
    "Page": [
      "RelPage",
      "SearchPage"
    ],
    "PageEdge": [
      "RelPageEdge",
      "SearchPageEdge"
    ]
  }
};
      export default result;
    