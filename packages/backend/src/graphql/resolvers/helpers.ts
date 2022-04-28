import * as GE from '@moodlenet/common/dist/content-graph/types/edge'
import * as GN from '@moodlenet/common/dist/content-graph/types/node'
import { AssetRef } from '@moodlenet/common/dist/graphql/scalars.graphql'
import * as GQL from '@moodlenet/common/dist/graphql/types.graphql.gen'
import { UploadType } from '@moodlenet/common/dist/staticAsset/lib'
import {
  gqlEdgeId2GraphEdgeIdentifier,
  gqlNodeId2GraphNodeIdentifier,
} from '@moodlenet/common/dist/utils/content-graph/id-key-type-guards'
import { assertNever } from '@moodlenet/common/dist/utils/misc'
import { pick } from '@moodlenet/common/dist/utils/object'
import { DistOmit, Maybe } from '@moodlenet/common/dist/utils/types'
import { Tuple } from 'tuple-type'
import { persistTempAssets } from '../../ports/static-assets/temp'
import { PersistTmpFileReq } from '../../ports/static-assets/types'

export const graphNode2GqlNode = (node: GN.GraphNode): GQL.Node => {
  const id = `${node._type}/${node._slug}`
  const base = {
    id,
    name: node.name,
    description: node.description,
    _published: node._published,
    _local: node._local,
    ...({} as Pick<GQL.Node, '_rel' | '_relCount'>),
  }

  if (node._type === 'Profile') {
    const _node: GQL.Profile = {
      __typename: 'Profile',
      ...base,
      ...pick(node, ['bio', 'firstName', 'lastName', 'location', 'image', 'avatar', 'siteUrl']),
    }
    return _node
  } else if (node._type === 'Collection') {
    const _node: GQL.Collection = {
      __typename: 'Collection',
      ...base,
      ...pick(node, ['image', 'name']),
    }
    return _node
  } else if (node._type === 'IscedField') {
    const _node: GQL.IscedField = {
      __typename: 'IscedField',
      ...base,
      ...pick(node, ['codePath', 'code']),
    }
    return _node
  } else if (node._type === 'IscedGrade') {
    const _node: GQL.IscedGrade = {
      __typename: 'IscedGrade',
      ...base,
      ...pick(node, ['codePath', 'code']),
    }
    return _node
  } else if (node._type === 'Organization') {
    const _node: GQL.Organization = {
      __typename: 'Organization',
      ...base,
      ...pick(node, ['color', 'domain', 'logo', 'logo', 'smallLogo', 'subtitle']),
    }
    return _node
  } else if (node._type === 'Resource') {
    const _node: GQL.Resource = {
      __typename: 'Resource',
      ...base,
      ...pick(node, ['content', 'image', 'kind', 'originalCreationDate']),
    }
    return _node
  } else if (node._type === 'FileFormat') {
    const _node: GQL.FileFormat = {
      __typename: 'FileFormat',
      ...base,
      ...pick(node, ['code', 'subtype', 'type']),
    }
    return _node
  } else if (node._type === 'Language') {
    const _node: GQL.Language = {
      __typename: 'Language',
      ...base,
      ...pick(node, ['langType', 'part1', 'part2b', 'part2t', 'scope']),
    }
    return _node
  } else if (node._type === 'License') {
    const _node: GQL.License = {
      __typename: 'License',
      ...base,
      ...pick(node, ['code']),
    }
    return _node
  } else if (node._type === 'ResourceType') {
    const _node: GQL.ResourceType = {
      __typename: 'ResourceType',
      ...base,
      ...pick(node, ['code']),
    }
    return _node
  } else {
    return assertNever(node, `graphNode2GqlNode: can't map unknown node type '${(node as any)?._type}'`)
  }
}

type OmitNodeProps = '_permId' | '_authKey' | '_created' | '_edited' | '_creator' | '_local'
export const gqlNode2GraphNode = (node: GQL.Node): DistOmit<GN.GraphNode, OmitNodeProps> => {
  const parsed = gqlNodeId2GraphNodeIdentifier(node.id)
  if (!parsed) {
    throw new Error(`gqlNode2GraphNode: can't parse id '${node.id}'`)
  }
  const { _slug } = parsed
  const base = {
    _slug,
    _published: node._published,
    name: node.name,
    description: node.description,
  }

  if (node.__typename === 'Profile') {
    const _node: Omit<GN.Profile, OmitNodeProps> = {
      _type: 'Profile',
      ...base,
      ...pick(node, ['bio', 'firstName', 'lastName', 'location', 'image', 'avatar', 'siteUrl', 'description']),
    }
    return _node
  } else if (node.__typename === 'Collection') {
    const _node: Omit<GN.Collection, OmitNodeProps> = {
      _type: 'Collection',
      ...base,
      ...pick(node, ['image', 'name']),
    }
    return _node
  } else if (node.__typename === 'IscedField') {
    const _node: Omit<GN.IscedField, OmitNodeProps> = {
      _type: 'IscedField',
      ...base,
      ...pick(node, ['codePath', 'image', 'code', 'image']),
    }
    return _node
  } else if (node.__typename === 'IscedGrade') {
    const _node: Omit<GN.IscedGrade, OmitNodeProps> = {
      _type: 'IscedGrade',
      ...base,
      ...pick(node, ['codePath', 'image', 'code', 'image']),
    }
    return _node
  } else if (node.__typename === 'Organization') {
    const _node: Omit<GN.Organization, OmitNodeProps> = {
      _type: 'Organization',
      ...base,
      ...pick(node, ['color', 'domain', 'logo', 'logo', 'smallLogo', 'subtitle']),
    }
    return _node
  } else if (node.__typename === 'Resource') {
    const _node: Omit<GN.Resource, OmitNodeProps> = {
      _type: 'Resource',
      ...base,
      ...pick(node, ['content', 'kind', 'image', 'originalCreationDate']),
    }
    return _node
  } else if (node.__typename === 'FileFormat') {
    const _node: Omit<GN.FileFormat, OmitNodeProps> = {
      _type: 'FileFormat',
      ...base,
      ...pick(node, ['code', 'subtype', 'type']),
    }
    return _node
  } else if (node.__typename === 'Language') {
    const _node: Omit<GN.Language, OmitNodeProps> = {
      _type: 'Language',
      ...base,
      ...pick(node, ['langType', 'part1', 'part2b', 'part2t', 'scope']),
    }
    return _node
  } else if (node.__typename === 'License') {
    const _node: Omit<GN.License, OmitNodeProps> = {
      _type: 'License',
      ...base,
      ...pick(node, ['code']),
    }
    return _node
  } else if (node.__typename === 'ResourceType') {
    const _node: Omit<GN.ResourceType, OmitNodeProps> = {
      _type: 'ResourceType',
      ...base,
      ...pick(node, ['code']),
    }
    return _node
  } else {
    return assertNever(node, `gqlNode2GraphNode: can't map unknown node type '${(node as any)?.__typename}'`)
  }
}

export const graphEdge2GqlEdge = (edge: GE.GraphEdge): GQL.Edge => {
  const id = `${edge._type}/${edge.id}`
  const base = { id, _created: edge._created }

  if (edge._type === 'Created') {
    const _edge: GQL.Created = {
      __typename: 'Created',
      ...base,
    }
    return _edge
  } else if (edge._type === 'Features') {
    const _edge: GQL.Features = {
      __typename: 'Features',
      ...base,
    }
    return _edge
  } else if (edge._type === 'Follows') {
    const _edge: GQL.Follows = {
      __typename: 'Follows',
      ...base,
    }
    return _edge
  } else if (edge._type === 'Likes') {
    const _edge: GQL.Likes = {
      __typename: 'Likes',
      ...base,
    }
    return _edge
  } else if (edge._type === 'Bookmarked') {
    const _edge: GQL.Bookmarked = {
      __typename: 'Bookmarked',
      ...base,
    }
    return _edge
  } else {
    return assertNever(edge, `graphEdge2GqlEdge: can't map unknown edge type '${(edge as any)?._type}''`)
  }
}

type OmitEdgeProps = '_creator' | '_created' | '_edited'
export const gqlEdge2GraphEdge = (edge: GQL.Edge): DistOmit<GE.GraphEdge, OmitEdgeProps> => {
  const parsed = gqlEdgeId2GraphEdgeIdentifier(edge.id)
  if (!parsed) {
    throw new Error(`gqlEdge2GraphEdge: can't parse id '${edge.id}'`)
  }
  const { id } = parsed
  const base = { id, _created: edge._created }

  if (edge.__typename === 'Created') {
    const _edge: DistOmit<GE.Created, OmitEdgeProps> = {
      _type: 'Created',
      ...base,
    }
    return _edge
  } else if (edge.__typename === 'Features') {
    const _edge: DistOmit<GE.Features, OmitEdgeProps> = {
      _type: 'Features',
      ...base,
    }
    return _edge
  } else if (edge.__typename === 'Follows') {
    const _edge: DistOmit<GE.Follows, OmitEdgeProps> = {
      _type: 'Follows',
      ...base,
    }
    return _edge
  } else if (edge.__typename === 'Likes') {
    const _edge: DistOmit<GE.Likes, OmitEdgeProps> = {
      _type: 'Likes',
      ...base,
    }
    return _edge
  } else if (edge.__typename === 'Bookmarked') {
    const _edge: DistOmit<GE.Bookmarked, OmitEdgeProps> = {
      _type: 'Bookmarked',
      ...base,
    }
    return _edge
  } else {
    return assertNever(edge, `graphEdge2GqlEdge: can't map unknown edge type '${(edge as any)?._type}''`)
  }
}

type AssetRefInputAndType = { input: GQL.AssetRefInput; uploadType: UploadType }
export const mapAssetRefInputsToAssetRefs = async <N extends number>(
  tupleOfAssetRefInputAndType: Tuple<AssetRefInputAndType | undefined | null, N>,
): Promise<Tuple<Maybe<AssetRef>, N> | null> => {
  type PersistTmpFileReqOrAssetRef = PersistTmpFileReq | AssetRef

  const arrayOfMaybePersistTempFilesReqOrAssetRef = tupleOfAssetRefInputAndType.map<Maybe<PersistTmpFileReqOrAssetRef>>(
    assRefInpAndType => {
      if (!assRefInpAndType) {
        return assRefInpAndType
      }
      const { input, uploadType } = assRefInpAndType
      if (input.type === 'TmpUpload') {
        const persTmpFileReq: PersistTmpFileReq = {
          tempAssetId: input.location,
          uploadType,
          credits: input.credits ?? null,
        }
        return persTmpFileReq
      } else if (input.type === 'ExternalUrl') {
        const assetRef: AssetRef = {
          ext: true,
          location: input.location,
          mimetype: 'text/html',
          credits: input.credits ?? null,
        } // TODO: define mimetype for links
        return assetRef
      } else if (input.type === 'NoAsset') {
        return null
      } else if (input.type === 'NoChange') {
        return undefined
      } else {
        return assertNever(input.type, `mapAssetRefInputsToAssetRefs: unknown input type: '${input.type}'`)
      }
    },
  )

  const _isPersistReq = (_: Maybe<PersistTmpFileReqOrAssetRef>): _ is PersistTmpFileReq => !!_ && 'uploadType' in _

  const toPersistReqsTuple = arrayOfMaybePersistTempFilesReqOrAssetRef.filter(_isPersistReq)

  const assetFileDescArray = await persistTempAssets({ persistTmpFilesReqs: toPersistReqsTuple })

  if (!assetFileDescArray) {
    return null
  }

  const tupleOfMaybeAssetRef = arrayOfMaybePersistTempFilesReqOrAssetRef.map<Maybe<AssetRef>>(
    maybePersistTmpFileReqOrAssetRef => {
      if (!_isPersistReq(maybePersistTmpFileReqOrAssetRef)) {
        return maybePersistTmpFileReqOrAssetRef
      }
      const reqIndex = toPersistReqsTuple.indexOf(maybePersistTmpFileReqOrAssetRef)
      const { assetId, tempAssetDesc } = assetFileDescArray[reqIndex]!
      const assetRef: AssetRef = {
        ext: false,
        location: assetId,
        mimetype: tempAssetDesc.mimetype,
        credits: maybePersistTmpFileReqOrAssetRef.credits ?? null,
      }
      return assetRef
    },
  )

  return tupleOfMaybeAssetRef as Tuple<Maybe<AssetRef>, N>
}

export const getAssetRefInputAndType = (
  assetRefInput: GQL.AssetRefInput | undefined | null,
  uploadType: UploadType,
): AssetRefInputAndType | undefined | null => assetRefInput && { input: assetRefInput, uploadType }

export const editNodeMutationError = (
  type: GQL.EditNodeMutationErrorType,
  details: string | null = null,
): GQL.EditNodeMutationError => ({
  __typename: 'EditNodeMutationError',
  type,
  details,
})

export const createNodeMutationError = (
  type: GQL.CreateNodeMutationErrorType,
  details: string | null = null,
): GQL.CreateNodeMutationError => ({
  __typename: 'CreateNodeMutationError',
  type,
  details,
})

export const createEdgeMutationError = (
  type: GQL.CreateEdgeMutationErrorType,
  details: string | null = null,
): GQL.CreateEdgeMutationError => ({
  __typename: 'CreateEdgeMutationError',
  type,
  details,
})

export const deleteEdgeMutationError = (
  type: GQL.DeleteEdgeMutationErrorType,
  details: string | null = null,
): GQL.DeleteEdgeMutationError => ({
  __typename: 'DeleteEdgeMutationError',
  type,
  details,
})

export const deleteNodeMutationError = (
  type: GQL.DeleteNodeMutationErrorType,
  details: string | null = null,
): GQL.DeleteNodeMutationError => ({
  __typename: 'DeleteNodeMutationError',
  type,
  details,
})
