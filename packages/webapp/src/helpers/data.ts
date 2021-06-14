import { UploadType } from '@moodlenet/common/lib/staticAsset/lib'
import { useMemo } from 'react'
import { Tuple } from 'tuple-type'
import { STATIC_ASSET_BASE } from '../constants'
import { useSession } from '../contexts/Global/Session'
import { AssetRefInput } from '../graphql/pub.graphql.link'

type UIAssetInput = {
  data: File | null | undefined
  type: UploadType
}

export const mapUIAssetInputToAssetRefInput = (apiKey: string) => async (input: UIAssetInput) => {
  const { data, type } = input
  const assetRefInput: AssetRefInput | Promise<AssetRefInput> =
    data === undefined
      ? { type: 'NoChange', location: '' }
      : data === null
      ? { type: 'NoAsset', location: '' }
      : uploadTempFile(apiKey)(type, data).then<AssetRefInput>(location => ({
          location,
          type: 'TmpUpload',
        }))
  return assetRefInput
}

export const mapTupleUIAssetInputToAssetRefInput =
  (apiKey: string) =>
  async <N extends number>(inputs: Tuple<UIAssetInput, N>): Promise<Tuple<AssetRefInput, N>> =>
    Promise.all(inputs.map(mapUIAssetInputToAssetRefInput(apiKey))) as Promise<Tuple<AssetRefInput, N>>

export const uploadTempFile =
  (apiKey: string) =>
  async (assetType: UploadType, file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', assetType)
    const url = `${STATIC_ASSET_BASE}/upload-temp`
    return (
      fetch(url, {
        method: 'POST',
        body: formData as any,
        headers: {
          //@ts-ignore
          bearer: apiKey,
          // 'Content-Type': 'multipart/form-data',
        },
      })
        // .catch(e => (console.error(e), Promise.reject(e)))
        .then(resp => (resp.status === 200 ? resp.text() : Promise.reject('unknown')))
    )
  }

export const useMapTupleUIAssetInputToAssetRefInput = () => {
  const { lastSessionJwt } = useSession()
  return useMemo(() => lastSessionJwt && mapTupleUIAssetInputToAssetRefInput(lastSessionJwt), [lastSessionJwt])
}

export const hasNoValue = (_: any): _ is null | undefined | void => [null, undefined].includes(_)
