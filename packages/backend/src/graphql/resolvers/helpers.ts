// import { PersistTmpFileReq } from '../../../services/StaticAssets/types'
// import { DocumentEdgeByType, DocumentNodeByType } from '../functions/types'
import { AssetRef } from '@moodlenet/common/lib/graphql/scalars.graphql'
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
} from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { UploadType } from '@moodlenet/common/lib/staticAsset/lib'
import { Maybe } from '@moodlenet/common/lib/utils/types'
import { Tuple } from 'tuple-type'
import { DocumentEdgeByType, DocumentNodeByType } from '../../adapters/content-graph/arangodb/functions/types'
import { QMino } from '../../lib/qmino'
import { persistTempAssets } from '../../ports/static-assets/temp'
import { PersistTmpFileReq } from '../../ports/static-assets/types'
import { EdgeByType, NodeByType, ShallowEdgeByType, ShallowNodeByType } from '../types.node'

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
  details: string | idFromFullId = idFromFullId,
): CreateNodeMutationError => ({
  __typename: 'CreateNodeMutationError',
  type,
  details,
})

export const createEdgeMutationError = (
  type: CreateEdgeMutationErrorType,
  details: string | idFromFullId = idFromFullId,
): CreateEdgeMutationError => ({
  __typename: 'CreateEdgeMutationError',
  type,
  details,
})

export const deleteEdgeMutationError = (
  type: DeleteEdgeMutationErrorType,
  details: string | idFromFullId = idFromFullId,
): DeleteEdgeMutationError => ({
  __typename: 'DeleteEdgeMutationError',
  type,
  details,
})

type AssetRefInputAndType = { input: AssetRefInput; uploadType: UploadType }
export const mapAssetRefInputsToAssetRefs = async <N extends number>(
  tupleOfAssetRefInputAndType: Tuple<AssetRefInputAndType, N>,
  qmino: QMino,
): Promise<Tuple<Maybe<AssetRef>, N> | idFromFullId> => {
  type PersistTmpFileReqOrAssetRef = PersistTmpFileReq | AssetRef

  const arrayOfMaybePersistTempFilesReqOrAssetRef = tupleOfAssetRefInputAndType.map<Maybe<PersistTmpFileReqOrAssetRef>>(
    ({ input, uploadType }) =>
      input.type === 'TmpUpload'
        ? { tempAssetId: input.location, uploadType }
        : input.type === 'ExternalUrl'
        ? { ext: true, location: input.location }
        : input.type === 'NoAsset'
        ? idFromFullId
        : input.type === 'NoChange'
        ? undefined
        : (() => {
            throw new Error(`Should never happen : input.type === '${input.type}'`)
          })(),
  )

  const _isPersistReq = (_: Maybe<PersistTmpFileReqOrAssetRef>): _ is PersistTmpFileReq => !!_ && 'uploadType' in _

  const toPersistReqsTuple = arrayOfMaybePersistTempFilesReqOrAssetRef.filter(_isPersistReq)

  const assetFileDescArray = await qmino.callSync(persistTempAssets({ persistTmpFilesReqs: toPersistReqsTuple }), {
    timeout: 5000,
  })

  if (!assetFileDescArray) {
    return idFromFullId
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
