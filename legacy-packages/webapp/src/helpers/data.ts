import {
  AssetRef,
  Credits,
} from '@moodlenet/common/dist/graphql/scalars.graphql'
import {
  getAssetRefUrl,
  UploadType,
} from '@moodlenet/common/dist/staticAsset/lib'
import { nodeGqlId2UrlPath } from '@moodlenet/common/dist/webapp/sitemap/helpers'
import Fuse from 'fuse.js'
import { useMemo, useState } from 'react'
import { Tuple } from 'tuple-type'
import { STATIC_ASSET_BASE } from '../constants'
import { useSession } from '../context/Global/Session'
import { AssetRefInput } from '../graphql/pub.graphql.link'

type UIAssetInput = {
  data: string | File | null | undefined
  type: UploadType
  credits: Credits
}

export const mapUIAssetInputToAssetRefInput =
  (apiKey: string) => async (input: UIAssetInput) => {
    const { data, type } = input
    const assetRefInput: AssetRefInput | Promise<AssetRefInput> =
      data === undefined
        ? { type: 'NoChange', location: '', credits: input.credits }
        : data === null
        ? { type: 'NoAsset', location: '', credits: input.credits }
        : 'string' === typeof data
        ? { type: 'ExternalUrl', location: data, credits: input.credits }
        : uploadTempFile(apiKey)(type, data).then<AssetRefInput>(
            (location) => ({
              location,
              type: 'TmpUpload',
              credits: input.credits,
            })
          )
    return assetRefInput
  }

export const mapTupleUIAssetInputToAssetRefInput =
  (apiKey: string) =>
  async <N extends number>(
    inputs: Tuple<UIAssetInput, N>
  ): Promise<Tuple<AssetRefInput, N>> =>
    Promise.all(inputs.map(mapUIAssetInputToAssetRefInput(apiKey))) as Promise<
      Tuple<AssetRefInput, N>
    >

export const useUploadTempFile = () => {
  const { lastSessionJwt } = useSession()
  return useMemo(() => {
    return lastSessionJwt
      ? uploadTempFile(lastSessionJwt)
      : () => Promise.reject('no jwt key available')
  }, [lastSessionJwt])
}
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
          bearer: apiKey,
          // 'Content-Type': 'multipart/form-data',
        },
      })
        // .catch(e => (console.error(e), Promise.reject(e)))
        .then((resp) =>
          resp.status === 200 ? resp.text() : Promise.reject('unknown')
        )
    )
  }

export const useMapTupleUIAssetInputToAssetRefInput = () => {
  const { lastSessionJwt } = useSession()
  return useMemo(
    () => lastSessionJwt && mapTupleUIAssetInputToAssetRefInput(lastSessionJwt),
    [lastSessionJwt]
  )
}

export const hasNoValue = (_: any): _ is null | undefined | void =>
  [null, undefined].includes(_)

export const getJustAssetRefUrl = (assetRef: AssetRef): string =>
  getAssetRefUrl({ assetRef, baseStaticAssetUrl: STATIC_ASSET_BASE })

export const getMaybeAssetRefUrl = (
  assetRef: AssetRef | null | undefined
): null | string => (assetRef ? getJustAssetRefUrl(assetRef) : null)

// export const _getMaybeAssetRefUrlOrPicsumImage = (
//   assetRef: AssetRef | null | undefined,
//   id: string,
//   type: 'icon' | 'image' | 'avatar',
// ): string =>
//   getMaybeAssetRefUrl(assetRef) ??
//   `https://picsum.photos/seed/${id.replaceAll('/', '_')}_${type}_/${type === 'icon' ? '200/200' : '800/600'}`

export const useFiltered = <T>(list: T[], keys: string) => {
  const [filterText, setFilterText] = useState('')

  const filteredList = useMemo(
    () =>
      !filterText
        ? list
        : new Fuse(list, {
            keys: keys.split(';'),
            shouldSort: true,
          }).search(filterText),
    [filterText, list, keys]
  )
  return useMemo(
    () => [filteredList, setFilterText, list] as const,
    [filteredList, setFilterText, list]
  )
}

export const fullLocalEntityUrlByGqlId = (gqlId: string) =>
  `${window.location.origin}${nodeGqlId2UrlPath(gqlId)}`
