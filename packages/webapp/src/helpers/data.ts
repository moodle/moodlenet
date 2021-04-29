//FIXME: sssscopied this in common.

import { UploadType } from '@moodlenet/common/lib/staticAsset/lib'
import { Tuple } from 'tuple-type'
import { STATIC_ASSET_BASE } from '../constants'
import { useSession } from '../contexts/Global/Session'
import { AssetRefInput } from '../graphql/pub.graphql.link'

// remove this and point to common
export const isJust = <J>(_: J | null | undefined): _ is J => (_ !== null && _ !== void 0 ? true : false)

type UIAssetInput = {
  data: File | null | undefined
  type: UploadType
}

export const mapToAssetRefInput = (apiKey: string) => async (input: UIAssetInput) => {
  const { data, type } = input
  const assetRefInput: AssetRefInput | Promise<AssetRefInput> =
    data === undefined
      ? { type: 'NoChange', location: '' }
      : data === null
      ? { type: 'Remove', location: '' }
      : uploadTempFile(apiKey)(type, data).then<AssetRefInput>(location => ({
          location,
          type: 'TmpUpload',
        }))
  return assetRefInput
}

export const mapTupleToAssetRefInput = (apiKey: string) => async <N extends number>(
  inputs: Tuple<UIAssetInput, N>,
): Promise<Tuple<AssetRefInput, N>> =>
  Promise.all(inputs.map(mapToAssetRefInput(apiKey))) as Promise<Tuple<AssetRefInput, N>>

export const uploadTempFile = (apiKey: string) => async (assetType: UploadType, file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  const url = `${STATIC_ASSET_BASE}/${assetType}`
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

export const useMapTupleToAssetRefInput = () => {
  const { lastSessionJwt } = useSession()
  return lastSessionJwt && mapTupleToAssetRefInput(lastSessionJwt)
}
