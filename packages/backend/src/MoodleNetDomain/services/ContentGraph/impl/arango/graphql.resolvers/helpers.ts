import { AssetRef } from '@moodlenet/common/lib/pub-graphql/types'
import { filterNullVoidProps, mapObjProps } from '@moodlenet/common/src/utils/object'
import { call } from '../../../../../../lib/domain/amqp/call'
import { Flow } from '../../../../../../lib/domain/flow'
import { MoodleNetDomain } from '../../../../../MoodleNetDomain'
import { AssetFileDescMap, AssetId, PersistTmpFileReqsMap, UploadType } from '../../../../StaticAssets/types'
import {
  AssetRefInput,
  CreateEdgeMutationError,
  CreateEdgeMutationErrorType,
  CreateNodeMutationError,
  CreateNodeMutationErrorType,
  DeleteEdgeMutationError,
  DeleteEdgeMutationErrorType,
  EdgeType,
  NodeType,
} from '../../../ContentGraph.graphql.gen'
import { EdgeByType, NodeByType, ShallowEdgeByType, ShallowNodeByType } from '../../../types.node'
import { DocumentEdgeByType, DocumentNodeByType } from '../functions/types'

export const fakeNodeByShallowOrDoc = <N extends NodeType>(
  shallowOrDoc: ShallowNodeByType<N> | DocumentNodeByType<N>,
): NodeByType<N> => ({ ...shallowOrDoc } as NodeByType<N>)
export const fakeEdgeByShallowOrDoc = <E extends EdgeType>(
  shallowOrDoc: ShallowEdgeByType<E> | DocumentEdgeByType<E>,
): EdgeByType<E> => ({ ...shallowOrDoc } as EdgeByType<E>)

// export const fakeNodeByDoc = <N extends NodeType>(
//   nodeDoc: DocumentNodeByType<N>,
// ): NodeByType<N> => fakeNodeByShallow(shallowNodeByDoc(nodeDoc))
// export const fakeEdgeByDoc = <E extends EdgeType>(
//   edgeDoc: DocumentEdgeByType<E>,
// ): EdgeByType<E> => fakeEdgeByShallow(shallowEdgeByDoc(edgeDoc))

// export const shallowNodeByDoc = <N extends NodeType>(nodeDoc: DocumentNodeByType<N>): ShallowNodeByType<N> =>
//   (({ ...nodeDoc, id: nodeDoc._id } as unknown) as ShallowNodeByType<N>)
// export const shallowEdgeByDoc = <E extends EdgeType>(edgeDoc: DocumentEdgeByType<E>): ShallowEdgeByType<E> =>
//   (({ ...edgeDoc, id: edgeDoc._id } as unknown) as ShallowEdgeByType<E>)

export const createNodeMutationError = (
  type: CreateNodeMutationErrorType,
  details: string | null = null,
): CreateNodeMutationError => ({
  __typename: 'CreateNodeMutationError',
  type,
  details,
})

export const createEdgeMutationError = (
  type: CreateEdgeMutationErrorType,
  details: string | null = null,
): CreateEdgeMutationError => ({
  __typename: 'CreateEdgeMutationError',
  type,
  details,
})

export const deleteEdgeMutationError = (
  type: DeleteEdgeMutationErrorType,
  details: string | null = null,
): DeleteEdgeMutationError => ({
  __typename: 'DeleteEdgeMutationError',
  type,
  details,
})

export type AssetIdMap<K extends string> = Record<K, AssetId>
export const getAssetIdMap = <K extends string>(assetFileMap: AssetFileDescMap<K>): AssetIdMap<K> =>
  mapObjProps(assetFileMap, assetFileDesc => assetFileDesc.assetId)

export const getAssetRefMap = <K extends string>(
  locationMap: Record<K, string>,
  locType: 'external' | 'local',
): AssetRefMap<K> => mapObjProps(locationMap, location => ({ location, ext: locType == 'external' }))

export type UploadTypeMap<K extends string> = Record<K, UploadType>
export const getPersistTmpFilesMap = <K extends string>(
  assetRefInputMap: AssetRefInputMap<K>,
  uploadTypes: UploadTypeMap<K>,
): PersistTmpFileReqsMap<string> => {
  const persistTmpFileReqsOrNullMap = mapObjProps(assetRefInputMap, (mAssetRefInput, key) => {
    if (!mAssetRefInput) {
      return null
    }
    const { location, type } = mAssetRefInput
    return type === 'TmpUpload' && location
      ? {
          tempFileId: location,
          uploadType: uploadTypes[key],
        }
      : null
  })
  return filterNullVoidProps(persistTmpFileReqsOrNullMap)
}

export const getExternalAssetRefMap = <K extends string>(
  assetRefInputMap: AssetRefInputMap<K>,
): AssetRefMap<string> => {
  const filteredAssetRefInputMap = mapObjProps(assetRefInputMap, mAssetRefInput => {
    if (!mAssetRefInput) {
      return null
    }
    const { location, type } = mAssetRefInput
    return type === 'ExternalUrl' ? { location, ext: true } : null
  })
  return filterNullVoidProps(filteredAssetRefInputMap)
}

type AssetRefMap<K extends string> = Record<K, AssetRef | null | undefined>
type AssetRefInputMap<K extends string> = Record<K, AssetRefInput | null | undefined>
export const getAssetRefMapFromAssetRefInputMap = async <K extends string>(
  inputMap: AssetRefInputMap<K>,
  uploadTypes: UploadTypeMap<K>,
  flow: Flow,
): Promise<AssetRefMap<K> | null> => {
  const toPersistFilesMap = getPersistTmpFilesMap(inputMap, uploadTypes)
  const persistMapHasKeys = Object.keys(toPersistFilesMap).length > 0
  const assetFileDescMap = persistMapHasKeys
    ? await call<MoodleNetDomain>()('StaticAssets.PersistTempFilesAll', flow)(toPersistFilesMap)
    : {}
  if (!assetFileDescMap) {
    return null
  }
  const assetIdMap = getAssetIdMap(assetFileDescMap)
  const localAssetsMap = getAssetRefMap(assetIdMap, 'local')
  const extAssetMap = getExternalAssetRefMap(inputMap)
  return {
    ...localAssetsMap,
    ...extAssetMap,
  } as AssetRefMap<K>
}
