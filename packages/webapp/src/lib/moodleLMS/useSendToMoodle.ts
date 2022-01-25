import { AssetRef } from '@moodlenet/common/dist/content-graph/types/node'
import { Maybe } from '@moodlenet/common/dist/utils/types'
import { nodeGqlId2UrlPath } from '@moodlenet/common/dist/webapp/sitemap/helpers'
import { useCallback, useMemo } from 'react'
import { License, Resource } from '../../graphql/pub.graphql.link'
import { getMaybeAssetRefUrl } from '../../helpers/data'
import { useLocalStorage } from '../keyvaluestore/useStorage'
import { LMSPrefs, sendToMoodle } from './LMSintegration'

export const useLMS = (
  obj: Maybe<{
    resource: Pick<Resource, 'id' | 'image' | 'name' | 'description'>
    license?: Pick<License, 'code'>
    asset: AssetRef
  }>
) => {
  const { updateLMSPrefs, currentLMSPrefs } = useLMSPrefs()
  const sendToLMS = useCallback(
    (_site?: Maybe<string>) => {
      const site = _site ?? currentLMSPrefs?.site
      if (!(obj && site)) {
        return false
      }
      if (_site && _site !== currentLMSPrefs?.site) {
        updateLMSPrefs({ ...currentLMSPrefs, site: _site })
      }
      const { asset, license, resource } = obj
      // const resUrl = getJustAssetRefUrl(asset)
      // FIXME: hardcoded url gen for local env ..
      const resUrl = asset.ext
        ? asset.location
        : `${window.location.protocol}//${window.location.host}/assets/${asset.location}`

      const resource_info = {
        canonicalUrl: `${window.location.protocol}//${
          window.location.host
        }${nodeGqlId2UrlPath(resource.id)}`,
        icon: getMaybeAssetRefUrl(resource.image) ?? '',
        licence: license?.code.toUpperCase() ?? 'N/A',
        name: resource.name,
        summary: resource.description,
        url: resUrl,
      }
      const resource_info_stringified = JSON.stringify(resource_info)

      const type = asset.ext ? 'link' : 'file'
      // console.log({ resUrl, resource_info, type, LMS })
      sendToMoodle(resUrl, resource_info_stringified, type, {
        ...currentLMSPrefs,
        site,
      })
      return true
    },
    [currentLMSPrefs, obj, updateLMSPrefs]
  )

  return useMemo(
    () => ({
      updateLMSPrefs,
      sendToLMS,
      currentLMSPrefs,
    }),
    [updateLMSPrefs, sendToLMS, currentLMSPrefs]
  )
}

export const useLMSPrefs = () => {
  const [currentLMSPrefs, updateLMSPrefs] = useLocalStorage<null | LMSPrefs>(
    `LMS_PREFS`
  )

  return useMemo(
    () => ({
      updateLMSPrefs,
      currentLMSPrefs,
    }),
    [updateLMSPrefs, currentLMSPrefs]
  )
}
