// import { PersistTmpFileReq } from '../../../services/StaticAssets/types'
// import { DocumentEdgeByType, DocumentNodeByType } from '../functions/types'
import { EdgeId, GraphEdge, GraphEdgeType } from '@moodlenet/common/lib/content-graph/types/edge'
import { GraphNode, GraphNodeType, Slug } from '@moodlenet/common/lib/content-graph/types/node'
import { AssetRef } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { AssetRefInput, Edge, Node } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { UploadType } from '@moodlenet/common/lib/staticAsset/lib'
import { isGraphEdgeType, isGraphNodeType } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { pick } from '@moodlenet/common/lib/utils/object'
import { Maybe } from '@moodlenet/common/lib/utils/types'
import { Tuple } from 'tuple-type'
import { QMino } from '../../lib/qmino'
import { persistTempAssets } from '../../ports/static-assets/temp'
import { PersistTmpFileReq } from '../../ports/static-assets/types'

export const graphNode2GqlNode = (node: GraphNode): Node => {
  const id = `${node._type}/${node._slug}`
  const base = {
    id,
    ...({} as Pick<Node, '_rel' | '_relCount'>),
  }
  switch (node._type) {
    case 'Profile':
      return {
        __typename: 'Profile',
        ...base,
        ...pick(node, ['bio', 'displayName', 'firstName', 'lastName', 'location', 'image', 'avatar', 'siteUrl']),
      }
    case 'Collection':
      return {
        __typename: 'Collection',
        ...base,
        ...pick(node, ['description', 'image', 'name']),
      }
    case 'Iscedf':
      return {
        __typename: 'Iscedf',
        ...base,
        ...pick(node, ['codePath', 'description', 'image', 'iscedCode', 'name', 'thumbnail']),
      }
    case 'OpBadge':
      return {
        __typename: 'OpBadge',
        ...base,
        ...pick(node, ['descripton', 'type']),
      }
    case 'Organization':
      return {
        __typename: 'Organization',
        ...base,
        ...pick(node, ['color', 'domain', 'name', 'logo', 'intro']),
      }
    case 'Resource':
      return {
        __typename: 'Resource',
        ...base,
        ...pick(node, ['content', 'thumbnail', 'name', 'kind', 'description']),
      }
    default:
      throw new Error(`graphNode2GqlNode: can't map unknown node type '${(node as any)?._type}'`)
  }
}
export const gqlNode2GraphNode = (node: Node): Omit<GraphNode, '_permId' | '_bumpStatus'> => {
  const parsed = parseNodeId(node.id)
  if (!parsed) {
    throw new Error(`gqlNode2GraphNode: can't parse id '${node.id}'`)
  }
  const [, _slug] = parsed
  const base = {
    _slug,
  }

  switch (node.__typename) {
    case 'Profile':
      return {
        _type: 'Profile',
        ...base,
        ...pick(node, ['bio', 'displayName', 'firstName', 'lastName', 'location', 'image', 'avatar', 'siteUrl']),
      }
    case 'Collection':
      return {
        _type: 'Collection',
        ...base,
        ...pick(node, ['description', 'image', 'name']),
      }
    case 'Iscedf':
      return {
        _type: 'Iscedf',
        ...base,
        ...pick(node, ['codePath', 'description', 'image', 'iscedCode', 'name', 'thumbnail']),
      }
    case 'OpBadge':
      return {
        _type: 'OpBadge',
        ...base,
        ...pick(node, ['descripton', 'type']),
      }
    case 'Organization':
      return {
        _type: 'Organization',
        ...base,
        ...pick(node, ['color', 'domain', 'name', 'logo', 'intro']),
      }
    case 'Resource':
      return {
        _type: 'Resource',
        ...base,
        ...pick(node, ['content', 'image', 'name', 'kind', 'description', 'thumbnail']),
      }
    default:
      throw new Error(`graphNode2GqlNode: can't map unknown node type '${(node as any)?._type}'`)
  }
}

export const graphEdge2GqlEdge = (edge: GraphEdge): Edge => {
  const id = `${edge._type}/${edge.id}`
  const _created = new Date(edge._created.at)
  const base = { id, _created }
  switch (edge._type) {
    case 'Created':
      return {
        __typename: 'Created',
        ...base,
      }
    case 'HasOpBadge':
      return {
        __typename: 'HasOpBadge',
        ...base,
      }
    default:
      throw new Error(`graphEdge2GqlEdge: can't map unknown edge type '${(edge as any)?._type}''`)
  }
}
export const gqlEdge2GraphEdge = (edge: Edge): GraphEdge => {
  const parsed = parseEdgeId(edge.id)
  if (!parsed) {
    throw new Error(`gqlEdge2GraphEdge: can't parse id '${edge.id}'`)
  }
  const [, id] = parsed
  const base = { id, _created: { at: Number(edge._created) } }
  switch (edge.__typename) {
    case 'Created':
      return {
        _type: 'Created',
        ...base,
      }
    case 'HasOpBadge':
      return {
        _type: 'HasOpBadge',
        ...base,
      }
    default:
      throw new Error(`graphEdge2GqlEdge: can't map unknown edge type '${(edge as any)?._type}''`)
  }
}

type AssetRefInputAndType = { input: AssetRefInput; uploadType: UploadType }
export const mapAssetRefInputsToAssetRefs = async <N extends number>(
  tupleOfAssetRefInputAndType: Tuple<AssetRefInputAndType, N>,
  qmino: QMino,
): Promise<Tuple<Maybe<AssetRef>, N> | null> => {
  type PersistTmpFileReqOrAssetRef = PersistTmpFileReq | AssetRef

  const arrayOfMaybePersistTempFilesReqOrAssetRef = tupleOfAssetRefInputAndType.map<Maybe<PersistTmpFileReqOrAssetRef>>(
    ({ input, uploadType }) => {
      switch (input.type) {
        case 'TmpUpload':
          return { tempAssetId: input.location, uploadType }
        case 'ExternalUrl':
          return { ext: true, location: input.location }
        case 'NoAsset':
          return null
        case 'NoChange':
          return undefined
        default:
          throw new Error(`mapAssetRefInputsToAssetRefs: unknown input type: '${input.type}'`)
      }
    },
  )

  const _isPersistReq = (_: Maybe<PersistTmpFileReqOrAssetRef>): _ is PersistTmpFileReq => !!_ && 'uploadType' in _

  const toPersistReqsTuple = arrayOfMaybePersistTempFilesReqOrAssetRef.filter(_isPersistReq)

  const assetFileDescArray = await qmino.callSync(persistTempAssets({ persistTmpFilesReqs: toPersistReqsTuple }), {
    timeout: 5000,
  })

  if (!assetFileDescArray) {
    return null
  }

  const tupleOfMaybeAssetRef = arrayOfMaybePersistTempFilesReqOrAssetRef.map<Maybe<AssetRef>>(
    maybePersistTmpFileReqOrAssetRef => {
      if (!_isPersistReq(maybePersistTmpFileReqOrAssetRef)) {
        return maybePersistTmpFileReqOrAssetRef
      }
      const reqIndex = toPersistReqsTuple.indexOf(maybePersistTmpFileReqOrAssetRef)
      const { assetId } = assetFileDescArray[reqIndex]!
      const assetRef: AssetRef = {
        ext: false,
        location: assetId,
      }
      return assetRef
    },
  )

  return tupleOfMaybeAssetRef as Tuple<Maybe<AssetRef>, N>
}

export const getAssetRefInputAndType = (
  assetRefInput: AssetRefInput,
  uploadType: UploadType,
): AssetRefInputAndType => ({ input: assetRefInput, uploadType })

export const parseNodeId = (id: string): [type: GraphNodeType, slug: Slug] | null => {
  const splitted = (id || '').split('/')
  if (splitted.length !== 2) {
    return null
  }
  const [type, slug] = splitted
  if (!(type && slug && isGraphNodeType(type))) {
    return null
  }
  return [type, slug]
}

export const parseEdgeId = (id: string): [type: GraphEdgeType, id: EdgeId] | null => {
  const splitted = (id || '').split('/')
  if (splitted.length !== 2) {
    return null
  }
  const [type, _id] = splitted
  if (!(type && _id && isGraphEdgeType(type))) {
    return null
  }
  return [type, _id]
}
